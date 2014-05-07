(function(exports){
    'use strict';

    var
    pico,
    create = function(name, ancestor){
        var properties = {
            moduleId: {value:name, writable:false, configurable:false, enumerable:true},
            base: {value:ancestor, writable:false, configurable:false, enumerable:true},
            slots: {value:{}, writable:false, configurable:false, enumerable:false},
        };
        if (ancestor){
            return Object.create(ancestor, properties);
        }
        return Object.create(pico.prototype, properties);
    },
    loadDeps = function(deps, cb){
    },
    loadAncestor = function(link, cb){
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
                });
            };
            script = script.substring(script.indexOf('{') + 1, script.lastIndexOf('}'));

            pico.objTools.mergeObj(pico.paths, options.paths);

            window.addEventListener('load', function(){
                if ('Phonegap' === pico.states.browser){
                    document.addEventListener('deviceready', onDeviceReady, false);
                }else{
                    onDeviceReady();
                }
            });
        },
        vm: function(name, script, cb){
            var
            mod = {exports:{}},
            me = mod.exports,
            deps = [],
            ancestorLink,
            require = function(link){ deps.push(link) },
            inherit = function(link){ ancestorLink = link };

            try{
                Function('exports', 'require', 'module', 'inherit', 'me', script).call(me, me, require, mod, inherit, me);
            }catch(exp){
                console.error(exp.stack);
                cb('script['+name+'] error: '+exp.message);
            }

            loadDeps(deps, function(err){
                if (err) return cb(err);
                loadAncestor(ancestorLink, function(err, ancestor){
                    if (err) return cb(err);
                })
            })

            modules[name] = mod;

            mod.signal(pico.LOAD);
        }
    };

    Object.defineProperties(pico, {
        LOAD:           {value:'load',          writable:false, configurable:false, enumerable:true},
        STATE_CHANGE:   {value:'stateChange',   writable:false, configurable:false, enumerable:true},
        HASH_CHANGE:    {value:'hashChange',    writable:false, configurable:false, enumerable:true},
        modules:        {value:{},              writable:false, configurable:false, enumerable:false},
        paths:          {value:{'*':''},        writable:false, configurable:false, enumerable:false},
        states:         {value:{},              writable:false, configurable:false, enumerable:false}
    });

    pico.prototype = {
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
})(window);

pico.def = function(name){
    var
    cb = (('undefined' !== typeof callback && callback instanceof Function) ? callback : function(err){if(err) console.warn(err)}),
    mod, parentURL, func;

    switch(arguments.length){
    case 2:
        // without ancestor
        func = arguments[1];
        break;
    case 3:
        // with ancestor
        parentURL = arguments[1];
        func = arguments[2];
        if ('string' !== typeof parentURL || -1 !== parentURL.indexOf('{')){
            // with callback 
            func = arguments[1];
            cb = arguments[2];
            parentURL = undefined;
        }
        break;
    case 4:
        parentURL = arguments[1];
        func = arguments[2];
        cb = arguments[3];
        break;
    default:
        return cb('too many or too few params (2~4) '+JSON.stringify(arguments));
    }

    pico.loadModuleFromURL(parentURL, function(err, ancestor){
        if (err) return cb(err);
        try{
            func = ('string' === typeof func ? func : func.toString());
            if (0 === func.indexOf('function')) func = func.substring(func.indexOf('{') + 1, func.lastIndexOf('}'));
            else if (-1 !== func.indexOf('pico.def')) {
                var bracket1 = func.indexOf('(')+1;
                return Function('cb', func.substring(0, bracket1)+'"'+name+'",'+func.substring(bracket1, func.lastIndexOf('}')+1)+',cb);')(cb);
            }
            var factory = Function('me', '"use strict";'+func);
        }catch(exp){
            return cb('Syntax Error at script: '+func);
        }

        // each pico object has their own slots and dependencies
        var properties = {
            moduleName: {value:name, writable:false, configurable:false, enumerable:true},
            base: {value:ancestor, writable:false, configurable:false, enumerable:true},
            slots: {value:{}, writable:false, configurable:false, enumerable:false},
            deps: {value:{}, writable:false, configurable:false, enumerable:false}
        };
        if (ancestor){
            mod = Object.create(ancestor, properties);
        }else{
            mod = Object.create(pico.prototype, properties);
        }

        factory.call(mod, mod); // this, me
        cb(null, mod);
    });
};
pico.getModule = function(key){
    return this.modules[key];
};
// recurssively load dependencies in a module, only fire LOAD event once
pico.loadDeps = function(host, cb){
    if (!cb) cb = function(){};
    var
    deps = host.deps,
    names = Object.keys(deps);
    if (!names || !names.length) return cb();

    var 
    name = names.pop(),
    url = deps[name];

    delete deps[name];

    pico.loadModuleFromURL(url, function(err, mod, fresh){
        if (err) console.warn(err);
        if (mod) {
            host[name] = mod;
            if (!fresh) return pico.loadDeps(host, cb); // not fresh, dun fire LOAD event
            pico.modules[url] = mod;
            return pico.loadDeps(mod, function(){
                mod.signal(pico.LOAD);
                return pico.loadDeps(host, cb);
            });
        }else{
            return pico.loadDeps(host, cb);
        }
    });
};
pico.loadModuleFromURL = function(url, cb){
    if (!url) return cb();
    var mod = this.modules[url];
    if (mod) return cb(null, mod, false);

    var
    keyPos = url.indexOf('/'),
    fname, path;

    if (-1 !== keyPos){
        path = pico.paths[url.substring(0, keyPos)];
        if (path){
            fname = path ? url.substr(keyPos+1) : url;
        }
    }
    fname = fname || url;
    path = path || pico.paths['*'] || '';

    pico.ajax('get', path+fname+'.js', '', null, function(err, xhr){
        if (err) return cb(err);
        if (4 !== xhr.readyState) return;
        pico.def(url, xhr.responseText, function(err, mod){
            if (err || !mod) return cb('loadModuleFromURL['+url+'] error: '+err);
            pico.modules[url] = mod;
            pico.loadDeps(mod, function(){
                return cb(null, mod, true);
            });
        });
    });
};
pico.loadModuleFromScript = function(name, parentURL, script, cb){
    if (!name) return cb();
    var mod = this.modules[name];
    if (mod) return cb(null, mod, false);

    pico.def(name, parentURL, script, function(err, mod){
        if (err || !mod) {
            return cb('loadModuleFromScript['+name+'] error: '+err);
        }
        pico.modules[name] = mod;
        pico.loadDeps(mod, function(){
            return cb(null, mod, true);
        });
    });
};
pico.embed = function(holder, url, cb){
  pico.ajax('get', url, '', null, function(err, xhr){
    if (err) return cb(err);
    if (4 !== xhr.readyState) return;
    holder.innerHTML = xhr.responseText;

    pico.embedJS(Array.prototype.slice.call(holder.getElementsByTagName('script')), function(){
        if (cb) return cb();
    });
  });
};
// always fire LOAD event when script is embed, due to dom have been reloaded
pico.embedJS = function(scripts, cb){
    if (!scripts || !scripts.length) return cb();

    var script = scripts.pop();

    if (script.type && -1 === script.type.indexOf('javascript')) return pico.embedJS(scripts, cb); // template node, ignore
    if (script.src){
        pico.loadModuleFromURL(script.src, function(err, mod){
            if (err) return pico.embedJS(scirpts, cb);
            pico.loadModuleFromURL(script.getAttribute('parent'), function(er, mod){
                if (mod){
                    mod.signal(pico.LOAD);
                }
                return pico.embedJS(scripts, cb);
            });
        });
    }

    pico.loadModuleFromScript(script.getAttribute('name'), script.getAttribute('parent'), script.textContent || script.innerText, function(err, mod){
        if (mod) mod.signal(pico.LOAD);
        return pico.embedJS(scripts, cb);
    });
};
// method: get/post
// url: path
// params: null/parameters (optional)
// headers: header parameter
// cb: callback
// userData: optional
pico.ajax = function(method, url, params, headers, cb, userData){
    if (!url) return cb(new Error('url not defined'));
    var
    xhr = window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP'),
    post = 'POST' === (method = method.toUpperCase()),
    paramIsString = 'string' === typeof params;

    url = encodeURI(url);

    if (!post){
        url += '?appVer='+pico.states.appVer;
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
};

pico.hash = function(str){
    var hash = 0;

    for (var i = 0, l=str.length; i < l; i++) {
        hash = ((hash<<5)-hash)+str.charCodeAt(i);
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
};
// http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
pico.detectEvent = function(eventName, tagName){
    var el = document.createElement(tagName || 'div');
    eventName = 'on' + eventName;
    var isSupported = (eventName in el) || (eventName in window);
    if (!isSupported) {
        el.setAttribute(eventName, 'return;');
        isSupported = 'function' === typeof el[eventName];
    }
    el = undefined;
    return isSupported;
};
pico.onStateChange = function(evt){
    pico.signal(pico.STATE_CHANGE, [pico.getState(), evt.state]);
};
pico.changeState = function(uri, desc, userData){
    var search = '?';
    for (var key in uri){
        if (!key) continue;
        search += key + '=' + uri[key] + '&';
    }
    // remove last & symbol
    history.pushState(userData, desc, search.substr(0, search.length-1));
    if (!this.states.isWebKit){
        this.onStateChange({});
    }
};
pico.getState = function(){
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
};
pico.onHashChange = function(evt){
    var newHash='', oldHash='';
    if (evt.oldURL) oldHash = evt.oldURL.substring(1) || '';
    if (evt.newURL) newHash = evt.newURL.substring(1) || '';
    else newHash = window.location.hash.substring(1) || '';

    pico.signal(pico.HASH_CHANGE, [oldHash, newHash]);
};
pico.changeHash = function(hash){
    window.location.hash = '#' + hash;
};
// query = tag#id
pico.addFrame = function(query, url, holder){
    holder = holder || document.body;
    var frame = holder.querySelector(query);
    if (!frame){
        var tagid = query.split('#');
        frame = document.createElement(tagid[0]);
        frame.id = tagid[1];
        holder.appendChild(frame);
    }
    this.embed(frame, url);
};
// effects = {opacity:[0,1,'1s'], left:['0%','100%','0.1s'], property:[startVal, endVal,duration,timing-function,delay]}
pico.changeFrame = function(query, url, effects, holder){
    holder = holder || document.body;
    var
    frame = holder.querySelector(query),
    te = this.states.transitionEnd;

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
};

//Object.freeze(pico);//for common tools to add functionality

window.addEventListener('popstate', function(evt){
    // change uri parameter
    pico.onStateChange(evt);
}, false);
window.addEventListener('hashchange', function(evt){
    pico.onHashChange(evt);
}, false);

(function(states){
  var
  te = 'transitionend',
  wkte = 'webkittransitionend',
  appVerTag = document.querySelector('meta[name=app-version]');

  states.transitionEnd = pico.detectEvent(te) ? te : pico.detectEvent(wkte) ? 'webkitTransitionEnd' : undefined;

  states.appVer = appVerTag ? appVerTag.getAttribute('content') : '0';

  if (document.URL.indexOf( 'http://' ) === -1 &&
      document.URL.indexOf( 'https://' ) === -1 &&
      navigator &&
      navigator.userAgent &&
      navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)){
      states.browser = 'Phonegap';
      states.isWebKit = true;
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

      states.browser = 'Unknown';
      states.isWebKit = false;

      for (var i=0, l=vendorKeys.length; i<l; i++){
          key = vendorKeys[i];
          if (key.string && -1 !== key.string.indexOf(key.subString)){
              states.browser = key.identity;
              states.isWebKit = -1 !== key.string.indexOf('WebKit');
              break;
          }
      }
  }
  console.log('pico states: '+JSON.stringify(states));
})(pico.states);
