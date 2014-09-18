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
        var
        notAllows = ['frameElement'],
        o = {}
        for(var k in g){
            if (-1 !== k.indexOf('webkit') || -1 !== notAllows.indexOf(k)) continue
            if (g[k] instanceof Function) o[k] = dummyCB
            else o[k] = dummyObj
        }
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

        obj.__proto__ = Object.create(ancestor, {
            moduleName: {value:link,    writable:false, configurable:false, enumerable:true},
            base:       {value:ancestor,writable:false, configurable:false, enumerable:true},
            slots:      {value:{},      writable:false, configurable:false, enumerable:false},
            signals:    {value:{},      writable:false, configurable:false, enumerable:false},
            contexts:   {value:{},      writable:false, configurable:false, enumerable:false},
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

        parseFunc(dummyGlobal, createMod(scriptLink, {}), function(l){var d=modules[l];if(d)return d;deps.push(l)},function(l){ancestorLink=l}, script)

        loadLink(ancestorLink, function(err, ancestor){
            if (err) return cb(err)

            var mod = parseFunc(exports, createMod(scriptLink, getMod(scriptLink), ancestor), getModAsync, dummyCB, '"use strict"\n'+script+(envs.production ? '' : '//# sourceURL='+scriptLink))
            loadDeps(deps, function(err){
                if (err) return cb(err)
                mod.signalStep(pico.LOAD, [])
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
            var
            h = document.getElementsByTagName("head")[0],
            ref
            switch(type){
            case 'js':
                ref=document.createElement('script')
                ref.setAttribute('src', url)
                ref.onload = cb
                ref.onerror = cb
                h.insertBefore(ref, h.lastChild)
                return 
            case 'css':
                ref=document.createElement('link')
                ref.setAttribute('rel', 'stylesheet')
                ref.setAttribute('href', url)
                h.insertBefore(ref, h.lastChild)
                return setTimeout(cb, 500)
            default: return cb()
            }
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
        createEvent: function(name, detail, bubbles, cancelable){
            var evt = document.createEvent('CustomEvent')
            evt.initCustomEvent(name, bubbles || false, cancelable || false, detail)
            return evt
        },
        vendor: function(name){
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
            con = this.contexts[channelName] = this.contexts[channelName] || {},
            evt = this.signals[channelName],
            h = hash(channelName+func.toString())

            channel[h] = func
            con[h] = context
            if (evt) func.apply(context, evt)
        },
        unslot: function(channelName, func){
            var
            slots = this.slots,
            contexts = this.contexts,
            k, c
            switch(arguments.length){
            case 0:
                for(k in slots) delete slots[k]
                for(k in contexts) delete contexts[k]
                break
            case 1:
                c = slots[channelName] || {}
                for(k in c) delete c[k]
                c = contexts[channelName] || {}
                for(k in c) delete c[k]
                break
            case 2:
                var h = hash(channelName + func.toString())
                c = slots[channelName] || {}
                if (c) delete c[h]
                c = contexts[channelName] || {}
                if (c) delete c[h]
                break
            }
        },
        signal: function(channelName, evt){
            var
            channel = this.slots[channelName],
            con = this.contexts[channelName],
            results = [],
            mod

            if (!channel) return results
            evt = evt || []

            for(var key in channel){
                results.push(channel[key].apply(con[key], evt))
            }
            return results
        },
        signalStep: function(channelName, evt){
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
        contexts:       {value:{},              writable:false, configurable:false, enumerable:false},
    })

    pico.prototype = {
        slot: pico.slot,
        unslot: pico.unslot,
        signal: pico.signal,
        signalStep: pico.signalStep,
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
}('undefined' === typeof window? global : window)
