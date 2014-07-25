!function(exports){
    'use strict'

    var
    pico,
    modules = {},
    paths = {'*':''},
    envs = {production:true},
    dummyCB = function(){},
    dummyObj = {},
    dummyGlobal = function(g){
        var o = {}
        for(var k in g)
            if (g[k] instanceof Function) o[k] = dummyCB
            else o[k] = dummyObj
        return o
    }(exports),
    consoleCB = function(){console.log(arguments)},
    hash = function(str){
        var hash = 0

        for (var i = 0, l=str.length; i < l; i++) {
            hash = ((hash<<5)-hash)+str.charCodeAt(i)
            hash = hash & hash // Convert to 32bit integer
        }
        return hash
    },
    createMod = function(link, obj, ancestor){
        ancestor = ancestor || pico.prototype

        var lastObj = obj
        while(lastObj.__proto__.__proto__ && lastObj.__proto__.__proto__ !== pico.prototype){ lastObj = lastObj.__proto__ }

        lastObj.__proto__ = Object.create(ancestor, {
            moduleName: {value:link,    writable:false, configurable:false, enumerable:true},
            base:       {value:ancestor,writable:false, configurable:false, enumerable:true},
            slots:      {value:{},      writable:false, configurable:false, enumerable:false},
            signals:    {value:{},      writable:false, configurable:false, enumerable:false},
        })
        return obj
    },
    getMod = function(link){
        var mod = modules[link]
        if (mod) return mod
        return modules[link] = {}
    },
    getModAsync = function(link, cb){
        return cb ? loadLink(link, cb) : getMod(link)
    },
    parseFunc = function(global, me, require, inherit, script){
        try{
            Function('exports', 'require', 'inherit', 'me', 'window', script).call(global, me, require, inherit, me, global)
            return me
        }catch(exp){
            //console.error(exp.fileName+' ('+exp.lineNumber+':'+exp.columnNumber+')')
            console.error(exp.stack)
        }
    },
    vm = function(scriptLink, script, cb){
        // 2 evaluation passes, 1st is a dry run to get deps, after loading deps, do the actual run
        var
        deps=[],
        ancestorLink

        parseFunc(dummyGlobal, createMod(scriptLink, getMod(scriptLink)), function(l){var d=modules[l];if(d)return d;deps.push(l)},function(l){ancestorLink=l}, script)

        loadLink(ancestorLink, function(err, ancestor){
            if (err) return cb(err)

            var mod = parseFunc(exports, createMod(scriptLink, getMod(scriptLink), ancestor), getModAsync, dummyCB, '"use strict"\n'+script+(envs.production ? '' : '//# sourceURL='+scriptLink))
            modules[scriptLink] = mod
            loadDeps(deps, function(err){
                if (err) return cb(err)
                mod.signal(pico.LOAD)
                cb(null, mod)
                deps = ancestorLink = ancestor = script = mod = undefined
            })
        })
    },
    loadLink = function(link, cb){
        if (!link) return cb()
        var mod = modules[link]
        if (mod && mod.moduleName) return cb(null, mod)

        var
        raw = '@' === link[0],
        symbol = raw ? link.substr(1) : link,
        fname = paths[symbol],
        path = ''

        if (!fname){
            var keyPos = symbol.indexOf('/')

            if (-1 !== keyPos){
                path = paths[symbol.substr(0, keyPos)]
            }
            fname = symbol.substr(keyPos+1)
            path = path || paths['*'] || ''
        }
        fname = raw ? fname : fname+'.js'

        pico.ajax('get', path+fname, '', null, function(err, xhr){
            if (err) return cb(err)
            if (4 !== xhr.readyState) return
            return raw ?  cb(null, (mod.text = xhr.responseText)) : vm(link, xhr.responseText, cb)
        })
    },
    // recurssively load dependencies in a module
    loadDeps = function(deps, cb){
        if (!cb) cb = function(){}
        if (!deps || !deps.length) return cb()

        var link = deps.shift()

        loadLink(link, function(err){
            if (err) return cb(err)
            return loadDeps(deps, cb)
        })
    },
    onStateChange = function(evt){
        pico.signal(pico.STATE_CHANGE, [pico.getState(), evt.state])
    },
    onHashChange = function(evt){
        var newHash='', oldHash=''
        if (evt.oldURL) oldHash = evt.oldURL.substring(1) || ''
        if (evt.newURL) newHash = evt.newURL.substring(1) || ''
        else newHash = exports.location.hash.substring(1) || ''

        pico.signal(pico.HASH_CHANGE, [oldHash, newHash])
    }

    pico = exports.pico = {
        start: function(options, cb){
            var
            name = options.name,
            script = cb.toString(),
            onDeviceReady = function(){
                vm(name, script, function(err, mod){
                    script = undefined
                    options = undefined

                    exports.addEventListener('popstate', onStateChange, false)
                    exports.addEventListener('hashchange', onHashChange, false)
                })
            }

            if (undefined !== options.production) envs.production = options.production
            script = script.substring(script.indexOf('{') + 1, script.lastIndexOf('}'))

            pico.objTools.mergeObj(paths, options.paths)

            exports.addEventListener('load', function(){
                if ('Phonegap' === envs.browser){
                    document.addEventListener('deviceready', onDeviceReady, false)
                }else{
                    onDeviceReady()
                }
            })
        },
        // for future file concatenating
        def: function(scriptLink, script){
            vm(srciptLink, script, dummyCB)
        },
        getEnv: function(key){ return envs[key] },
        // use require('html') insteads?
        embed: function(holder, url, cb){
            pico.ajax('get', url, '', null, function(err, xhr){
                if (err) return cb(err)
                if (4 !== xhr.readyState) return
                holder.innerHTML = xhr.responseText

                pico.embedJS(Array.prototype.slice.call(holder.getElementsByTagName('script')), cb)
            })
        },
        // always fire LOAD event when script is embed, due to dom have been reloaded
        embedJS: function(scripts, cb){
            if (!scripts || !scripts.length) return cb && cb()

            var
            script = scripts.shift(),
            link = script.getAttribute('link'),
            content = script.textContent || script.innerText

            if (!link) return pico.embedJS(scripts, cb) // non pico script tag, ignore

            if (content){
                vm(link, content, function(err){
                    if (err) console.error('embedJS ['+link+'] with content error: '+err)
                    return pico.embedJS(scripts, cb)
                })
            }else{
                loadLink(link, function(err){
                    if (err) console.error('embedJS['+link+'] without content error: '+err)
                    return pico.embedJS(scripts, cb)
                })
            }
        },

        // http://www.javascriptkit.com/javatutors/loadjavascriptcss.shtml
        attachFile: function(url, type, cb){
            var ref
            switch(type){
            case 'js':
                ref=document.createElement('script')
                ref.setAttribute('src', url)
            case 'css':
                ref=document.createElement('link')
                ref.setAttribute('rel', 'stylesheet')
                ref.setAttribute('href', url)
            }
            if (ref){
                ref.onload = cb
                ref.onerror = cb
                var h = document.getElementsByTagName("head")[0]
                h.insertBefore(ref, h.lastChild)
            }else if (cb) cb('')
        },
        detachFile: function(url, type){
            var attr, suspects
            switch(type){
            case 'js':
                suspects = document.getElementsByTagName('script')
                attr = 'src'
                break
            case 'css':
                suspects = document.getElementsByTagName('link')
                attr = 'href'
                break
            default:
                suspects = []
                break
            }
            for (var s,i=suspects.length; i>=0,s=suspects[i]; i--){ //search backwards within nodelist for matching elements to remove
                if (s && s.getAttribute(attr)!=null && s.getAttribute(attr).indexOf(url)!=-1)
                s.parentNode.removeChild(s) //remove element by calling parentNode.removeChild()
            }
        },

        // http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
        detectEvent: function(eventName, tagName){
            var el = document.createElement(tagName || 'div')
            eventName = 'on' + eventName
            var isSupported = (eventName in el) || (eventName in exports)
            if (!isSupported) {
                el.setAttribute(eventName, '')
                isSupported = 'function' === typeof el[eventName]
                el[eventName] = undefined
                el.removeAttribute(eventName)
            }
            el = undefined
            return isSupported
        },
        changeState: function(uri, desc, userData){
            var search = '?'
            for (var key in uri){
                if (!key) continue
                search += key + '=' + uri[key] + '&'
            }
            // remove last & symbol
            history.pushState(userData, desc, search.substr(0, search.length-1))
            if (!this.envs.isWebKit){
                this.onStateChange({})
            }
        },
        getState: function(){
            var
            search = location.search.substring(1), // remove leading ?
            pairs = search.split('&'),
            pair, obj={}
            for (var i=0, l=pairs.length; i<l; i++){
                pair = pairs[i].split('=')
                if (!pair[0]) continue
                obj[pair[0]] = pair[1]
            }
            return obj
        },
        changeHash: function(hash){
            exports.location.hash = '#' + hash
        },
        // query = tag#id
        addFrame: function(query, url, holder){
            holder = holder || document.body
            var frame = holder.querySelector(query)
            if (!frame){
                var tagid = query.split('#')
                frame = document.createElement(tagid[0])
                frame.id = tagid[1]
                holder.appendChild(frame)
            }
            this.embed(frame, url)
        },
        // effects = {opacity:[0,1,'1s'], left:['0%','100%','0.1s'], property:[startVal, endVal,duration,timing-function,delay]}
        changeFrame: function(query, url, effects, holder){
            holder = holder || document.body
            var
            frame = holder.querySelector(query),
            te = envs.transitionEnd

            if (!frame || !te) return this.addFrame(query, url, holder)

            var
            style = frame.style,
            keys = Object.keys(effects),
            properties=[],durations=[],tfuncs=[],delays=[],
            vl,key,value,
            onTransitEnd = function(evt){
                frame.removeEventListener(te, onTransitEnd)

                pico.embed(frame, url, function(err){
                    if (err) return console.error(err)

                    for(var i=0,l=keys.length; i<l; i++){
                        key = keys[i]
                        value = effects[key]
                        style[key] = value[1]
                    }
                })
            }

            frame.addEventListener(te, onTransitEnd, false)

            for(var i=0,l=keys.length; i<l; i++){
                key = keys[i]
                value = effects[key]
                vl = value.length
                if (vl < 3) {
                    frame.removeEventListener(te, onTransitEnd)
                    return console.error('invalid effect:'+value)
                }
                style[key] = value[0]
                properties.push(key)
                durations.push(value[2])
                if (vl > 3) tfuncs.push(value[3]) 
                if (vl > 4) delays.push(value[4]) 
            }
            
            style['-webkit-transition-property'] = style['transition-property'] = properties.join(' ')
            style['-webkit-transition-duration'] = style['transition-duration'] = durations.join(' ')
            if (tfuncs.length) style['-webkit-transition-timing-function'] = style['transition-timing-function'] = tfuncs.join(' ')
            if (delays.length) style['-webkit-transition-delay'] = style['transition-delay'] = delays.join(' ')
        },

        // method: get/post, url: path, params: null/parameters (optional), headers: header parameter, cb: callback, userData: optional
        ajax: function(method, url, params, headers, cb, userData){
            cb = cb || dummyCB
            if (!url) return cb(new Error('url not defined'))
            var
            xhr = exports.XMLHttpRequest ? new exports.XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP'),
            post = 'POST' === (method = method.toUpperCase()),
            dataType = ('string' === typeof params ? 1 : (params instanceof FormData ? 3 : 2))

            url = encodeURI(url)

            if (!post){
                url += '?appVer='+envs.appVer
                if (params){
                    url += '&'
                    switch(dataType){
                    case 1: url += encodeURIComponent(params); break
                    case 2: url += Object.keys(params).reduce(function(a,k){a.push(k+'='+encodeURIComponent(params[k]));return a},[]).join('&'); break
                    case 3: return cb(new Error('FormData with GET method is not supported yet'))
                    }
                    params = null
                }
            }

            xhr.open(method, url, true)

            xhr.onreadystatechange=function(){
                if (1 < xhr.readyState && cb){
                    var st = xhr.status
                    return cb((200 === st || !st) ? null : new Error("Error["+xhr.statusText+"] Info: "+xhr.responseText), xhr, userData)
                }
            }
            xhr.onerror=function(evt){cb(evt, xhr, userData)}
            // never set Content-Type, it will trigger preflight options and chrome 35 has problem with json type
            //if (post && params && 2 === dataType) xhr.setRequestHeader('Content-Type', 'application/json')
            if (post && params && 3 !== dataType) xhr.setRequestHeader('Content-Type', 'text/plain')
            for (var key in headers) xhr.setRequestHeader(key, headers[key])

            switch(dataType){
            case 1: xhr.send(params); break
            case 2: xhr.send(JSON.stringify(params)); break
            case 3: xhr.send(params); break
            }
        },

        slot: function(channelName, func, context){
            var
            channel = this.slots[channelName] = this.slots[channelName] || {},
            evt = this.signals[channelName]

            if (context){
                channel[context.moduleName] = func
            }else{
                // function only no object
                channel[hash(func.toString())] = func
            }
            if (evt) func.apply(context, evt)
        },
        unslot: function(channelName, context){
            var channel = this.slots[channelName] = this.slots[channelName] || {}
            if (context.moduleName){
                delete channel[context.moduleName]
            }else{
                // function only no object
                delete channel[hash(context.toString())]
            }
        },
        signal: function(channelName, evt){
            var
            channel = this.slots[channelName],
            results = [],
            mod

            if (!channel) return results
            evt = evt || []

            for(var key in channel){
                mod = modules[key]
                results.push(channel[key].apply(mod, evt))
            }
            return results
        },
        step: function(channelName, evt){
            this.signals[channelName] = evt
            this.signal(channelName, evt)
        }
    }

    Object.defineProperties(pico, {
        LOAD:           {value:'load',          writable:false, configurable:false, enumerable:true},
        STATE_CHANGE:   {value:'stateChange',   writable:false, configurable:false, enumerable:true},
        HASH_CHANGE:    {value:'hashChange',    writable:false, configurable:false, enumerable:true},
        slots:          {value:{},              writable:false, configurable:false, enumerable:false},
        signals:        {value:{},              writable:false, configurable:false, enumerable:false},
    })

    pico.prototype = {
        slot: pico.slot,
        unslot: pico.unslot,
        signal: pico.signal,
        step: pico.step,
    }

    !function(){
        var
        te = 'transitionend',
        wkte = 'webkittransitionend',
        appVerTag = document.querySelector('meta[name=app-version]')

        envs.transitionEnd = pico.detectEvent(te) ? te : pico.detectEvent(wkte) ? 'webkitTransitionEnd' : undefined

        envs.appVer = appVerTag ? appVerTag.getAttribute('content') : '0'

        if (document.URL.indexOf( 'http://' ) === -1 &&
            document.URL.indexOf( 'https://' ) === -1 &&
            navigator &&
            navigator.userAgent &&
            navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)){
            envs.browser = 'Phonegap'
            envs.isWebKit = true
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
            key

            envs.browser = 'Unknown'
            envs.isWebKit = false

            for (var i=0, l=vendorKeys.length; i<l; i++){
              key = vendorKeys[i]
              if (key.string && -1 !== key.string.indexOf(key.subString)){
                  envs.browser = key.identity
                  envs.isWebKit = -1 !== key.string.indexOf('WebKit')
                  break
              }
            }
        }
        console.log('pico envs: '+JSON.stringify(envs))
    }()
}('undefined' === typeof window ? global : window)
