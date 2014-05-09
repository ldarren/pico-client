!function(exports){
    'use strict';

    var
    pico,
    modules = {},
    paths = {'*':''},
    envs = {},
    createMod = function(link, obj, ancestor){
        Object.defineProperties(obj, {
            moduleId: {value:link, writable:false, configurable:false, enumerable:true},
            base: {value:ancestor, writable:false, configurable:false, enumerable:true},
            slots: {value:{}, writable:false, configurable:false, enumerable:false},
        });
        if (ancestor){
            return modules[link] = Object.create(ancestor, obj);
        }
        return modules[link] = Object.create(pico.prototype, obj);
    },
    getMod = function(link, cb){
        var mod = modules[link];
        if (mod) return mod;
        if (cb instanceof Function){
            pico.loadLink(link, cb);
        }
    },
    parseFunc = function(require, inherit, script, cb){
        var
        mod = {exports:createMod('', {})},
        me = mod.exports;

        try{
            Function('exports', 'require', 'module', 'inherit', 'me', script).call(me, me, require, mod, inherit, me);
            return mod.exports;
        }catch(exp){
            console.error(exp.message);
            console.error(exp.stack);
        }
    },
    loadLink = function(link, cb){
        if (!link) return cb();
        var mod = modules[link];
        if (mod) return cb(null, mod);

        var
        keyPos = link.indexOf('/'),
        fname, path;

        if (-1 !== keyPos){
            path = paths[link.substring(0, keyPos)];
        }
        fname = path ? link.substr(keyPos+1) : link;
        path = path || paths['*'] || '';

        pico.ajax('get', path+fname+'.js', '', null, function(err, xhr){
            if (err) return cb(err);
            if (4 !== xhr.readyState) return;
            pico.vm(link, xhr.responseText, cb);
        });
    },
    // recurssively load dependencies in a module
    loadDeps = function(deps, cb){
        if (!cb) cb = function(){};
        if (!deps || !deps.length) return cb();

        var link = deps.pop();

        loadLink(link, function(err){
            if (err) return cb(err);
            return loadDeps(deps, cb);
        });
    },
    // always fire LOAD event when script is embed, due to dom have been reloaded
    embedJS = function(scripts, cb){
        if (!scripts || !scripts.length) return cb();

        var script = scripts.pop();

        if (script.type && -1 === script.type.indexOf('javascript')) return embedJS(scripts, cb); // template node, ignore

        var
        link = script.getAttribute('link'),
        content = script.textContent || script.innerText;

        if (content){
            pico.vm(link, content, function(err){
                if (err) console.error('embedJS ['+link+'] with content error: '+err);
                return embedJS(scripts, cb);
            });
        }else{
            loadLink(link, function(err){
                if (err) console.error('embedJS['+link+'] without content error: '+err);
                return embedJS(scripts, cb);
            });
        }
    };

    exports.pico = pico = {
        start: function(options, cb){
            var
            name = options.name,
            script = cb.toString(),
            onDeviceReady = function(){
                pico.vm(name, script, function(err, mod){
                    script = undefined;
                    options = undefined;

                    window.addEventListener('popstate', onStateChange, false);
                    window.addEventListener('hashchange', onHashChange, false);
                });
            };
            script = script.substring(script.indexOf('{') + 1, script.lastIndexOf('}'));

            pico.objTools.mergeObj(paths, options.paths);

            window.addEventListener('load', function(){
                if ('Phonegap' === envs.browser){
                    document.addEventListener('deviceready', onDeviceReady, false);
                }else{
                    onDeviceReady();
                }
            });
        },
        vm: function(scriptLink, script, cb){
            var
            deps = [],
            ancestorLink;
            
            if (!parseFunc(function(link){ deps.push(link) }, function(link){ ancestorLink = link }, script))
                return cb('error parsing '+scriptLink);

            loadLink(ancestorLink, function(err, ancestor){
                if (err) return cb(err);

                loadDeps(deps, function(err){
                    if (err) return cb(err);
                    var mod = createMod(scriptLink, parseFunc(getMod, function(){}, 'use strict;\n'+script), ancestor);
                    mod.signal(pico.LOAD);
                })
            })
        },
        getEnv: function(key){ return envs[key] },

        embed: function(holder, url, cb){
          pico.ajax('get', url, '', null, function(err, xhr){
            if (err) return cb(err);
            if (4 !== xhr.readyState) return;
            holder.innerHTML = xhr.responseText;

            pico.embedJS(Array.prototype.slice.call(holder.getElementsByTagName('script')), function(){
                if (cb) return cb();
            });
          });
        },

        // http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
        detectEvent: function(eventName, tagName){
            var el = document.createElement(tagName || 'div');
            eventName = 'on' + eventName;
            var isSupported = (eventName in el) || (eventName in window);
            if (!isSupported) {
                el.setAttribute(eventName, 'return;');
                isSupported = 'function' === typeof el[eventName];
            }
            el = undefined;
            return isSupported;
        },
        onStateChange: function(evt){
            pico.signal(pico.STATE_CHANGE, [pico.getState(), evt.state]);
        },
        changeState: function(uri, desc, userData){
            var search = '?';
            for (var key in uri){
                if (!key) continue;
                search += key + '=' + uri[key] + '&';
            }
            // remove last & symbol
            history.pushState(userData, desc, search.substr(0, search.length-1));
            if (!this.envs.isWebKit){
                this.onStateChange({});
            }
        },
        getState: function(){
            var
            search = location.search.substring(1), // remove leading ?
            pairs = search.split('&'),
            pair, obj={};
            for (var i=0, l=pairs.length; i<l; i++){
                pair = pairs[i].split('=');
                if (!pair[0]) continue;
                obj[pair[0]] = pair[1];
            }
            return obj;
        },
        onHashChange: function(evt){
            var newHash='', oldHash='';
            if (evt.oldURL) oldHash = evt.oldURL.substring(1) || '';
            if (evt.newURL) newHash = evt.newURL.substring(1) || '';
            else newHash = window.location.hash.substring(1) || '';

            pico.signal(pico.HASH_CHANGE, [oldHash, newHash]);
        },
        changeHash: function(hash){
            window.location.hash = '#' + hash;
        },
        // query = tag#id
        addFrame: function(query, url, holder){
            holder = holder || document.body;
            var frame = holder.querySelector(query);
            if (!frame){
                var tagid = query.split('#');
                frame = document.createElement(tagid[0]);
                frame.id = tagid[1];
                holder.appendChild(frame);
            }
            this.embed(frame, url);
        },
        // effects = {opacity:[0,1,'1s'], left:['0%','100%','0.1s'], property:[startVal, endVal,duration,timing-function,delay]}
        changeFrame: function(query, url, effects, holder){
            holder = holder || document.body;
            var
            frame = holder.querySelector(query),
            te = this.envs.transitionEnd;

            if (!frame || !te) return this.addFrame(query, url, holder);

            var
            style = frame.style,
            keys = Object.keys(effects),
            properties=[],durations=[],tfuncs=[],delays=[],
            vl,key,value,
            onTransitEnd = function(evt){
                frame.removeEventListener(te, onTransitEnd);

                pico.embed(frame, url, function(err){
                    if (err) return console.error(err);

                    for(var i=0,l=keys.length; i<l; i++){
                        key = keys[i];
                        value = effects[key];
                        style[key] = value[1];
                    }
                });
            };

            frame.addEventListener(te, onTransitEnd, false);

            for(var i=0,l=keys.length; i<l; i++){
                key = keys[i];
                value = effects[key];
                vl = value.length;
                if (vl < 3) {
                    frame.removeEventListener(te, onTransitEnd);
                    return console.error('invalid effect:'+value);
                }
                style[key] = value[0];
                properties.push(key);
                durations.push(value[2]);
                if (vl > 3) tfuncs.push(value[3]); 
                if (vl > 4) delays.push(value[4]); 
            }
            
            style['-webkit-transition-property'] = style['transition-property'] = properties.join(' ');
            style['-webkit-transition-duration'] = style['transition-duration'] = durations.join(' ');
            if (tfuncs.length) style['-webkit-transition-timing-function'] = style['transition-timing-function'] = tfuncs.join(' ');
            if (delays.length) style['-webkit-transition-delay'] = style['transition-delay'] = delays.join(' ');
        },

        // method: get/post, url: path, params: null/parameters (optional), headers: header parameter, cb: callback, userData: optional
        ajax: function(method, url, params, headers, cb, userData){
            if (!url) return cb(new Error('url not defined'));
            var
            xhr = window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP'),
            post = 'POST' === (method = method.toUpperCase()),
            paramIsString = 'string' === typeof params;

            url = encodeURI(url);

            if (!post){
                url += '?appVer='+pico.envs.appVer;
                if (params){
                    url += '&';
                    if (paramIsString) url += +encodeURIComponent(params);
                    else url += Object.keys(params).reduce(function(a,k){a.push(k+'='+encodeURIComponent(params[k]));return a},[]).join('&');
                    params = null;
                }
            }

            xhr.open(method, url, true);

            xhr.onreadystatechange=function(){
                if (1 < xhr.readyState && cb){
                    var st = xhr.status;
                    return cb(
                        (200 === st || !st) ? null : new Error("Error["+xhr.statusText+"] Info: "+xhr.responseText),
                        xhr,
                        userData);
                }
            }
            xhr.onerror=function(evt){if (cb) return cb(evt, xhr, userData);}
            
            if (post && params && !paramIsString) xhr.setRequestHeader('Content-type', 'application/json');
            for (var key in headers){
                xhr.setRequestHeader(key, headers[key]);
            }

            if (params){
                xhr.send(paramIsString ? params : JSON.stringify(params));
            }else{
                xhr.send();
            }
        },

        slot: function(channelName){
            var channel = this.slots[channelName] = this.slots[channelName] || {};
            if (3 === arguments.length){
                channel[arguments[1].moduleName] = arguments[2];
            }else{
                // function only no object
                var func = arguments[1];
                channel[pico.hash(func.toString())] = func;
            }
        },
        unslot: function(channelName, identity){
            var channel = this.slots[channelName] = this.slots[channelName] || {};
            if (identity.moduleName){
                delete channel[identity.moduleName];
            }else{
                // function only no object
                delete channel[pico.hash(identity.toString())];
            }
        },
        signal: function(channelName, events){
            var
            channel = this.slots[channelName],
            results = [],
            mod,func;
            if (!channel) return results;
            
            events = events || [];

            for(var key in channel){
                mod = pico.modules[key];
                results.push(channel[key].apply(mod, events));
            }
            return results;
        }
    };

    Object.defineProperties(pico, {
        LOAD:           {value:'load',          writable:false, configurable:false, enumerable:true},
        STATE_CHANGE:   {value:'stateChange',   writable:false, configurable:false, enumerable:true},
        HASH_CHANGE:    {value:'hashChange',    writable:false, configurable:false, enumerable:true},
        slots:          {value:'hashChange',    writable:false, configurable:false, enumerable:false},
    });

    pico.prototype = {
        slot: pico.slot,
        unslot: pico.unslot,
        signal: pico.signal
    };

    !function(){
        var
        te = 'transitionend',
        wkte = 'webkittransitionend',
        appVerTag = document.querySelector('meta[name=app-version]');

        envs.transitionEnd = pico.detectEvent(te) ? te : pico.detectEvent(wkte) ? 'webkitTransitionEnd' : undefined;

        envs.appVer = appVerTag ? appVerTag.getAttribute('content') : '0';

        if (document.URL.indexOf( 'http://' ) === -1 &&
            document.URL.indexOf( 'https://' ) === -1 &&
            navigator &&
            navigator.userAgent &&
            navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)){
            envs.browser = 'Phonegap';
            envs.isWebKit = true;
        }else{
            var
            // http://www.quirksmode.org/js/detect.html
            vendorKeys = [
            { string: navigator.userAgent,  subString: "Chrome",    identity: "Chrome"},
            { string: navigator.userAgent,  subString: "OmniWeb",   identity: "OmniWeb"},
            { string: navigator.vendor,     subString: "Apple",     identity: "Safari"},
            { string: navigator.userAgent,  subString: "Opera",     identity: "Opera"},
            { string: navigator.vendor,     subString: "iCab",      identity: "iCab"},
            { string: navigator.vendor,     subString: "KDE",       identity: "Konqueror"},
            { string: navigator.userAgent,  subString: "Firefox",   identity: "Firefox"},
            { string: navigator.vendor,     subString: "Camino",    identity: "Camino"},
            { string: navigator.userAgent,  subString: "Netscape",  identity: "Netscape"},
            { string: navigator.userAgent,  subString: "MSIE",      identity: "Explorer"},
            { string: navigator.userAgent,  subString: "Gecko",     identity: "Mozilla"},
            { string: navigator.userAgent,  subString: "Mozilla",   identity: "Netscape"}],
            key;

            envs.browser = 'Unknown';
            envs.isWebKit = false;

            for (var i=0, l=vendorKeys.length; i<l; i++){
              key = vendorKeys[i];
              if (key.string && -1 !== key.string.indexOf(key.subString)){
                  envs.browser = key.identity;
                  envs.isWebKit = -1 !== key.string.indexOf('WebKit');
                  break;
              }
            }
        }
        console.log('pico envs: '+JSON.stringify(envs));
    }();
}(window);
