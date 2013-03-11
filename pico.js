pico = function(n){
  if (n){
    return Object.create(pico.inner,
      {
        _s: {writable:false, configurable:false, enumerable:false, value:[]},   // stack
        _n: {writable:false, configurable:false, enumerable:false, value:       // node list
        (n instanceof Element) ? [n] : Array.prototype.slice.call(document.querySelectorAll(n))}
      });
  }
  // each pico object has their own slots and dependencies
  Object.defineProperty(this, 'slots', {value:{}, writable:false, configurable:false, enumerable:false});
  Object.defineProperty(this, 'deps', {value:[], writable:false, configurable:false, enumerable:false});
  return this;
};
// shared by all pico objects
Object.defineProperty(pico.prototype, 'links', {value:{}, writable:true, configurable:false, enumerable:false});

pico.prototype.slot = pico.slot = function(channelName){
    var channel = this.slots[channelName] = this.slots[channelName] || {};
    if (3 === arguments.length){
        channel[arguments[1].moduleName] = arguments[2];
    }else{
        // function only no object
        var funcs = channel['funcs'] = channel['funcs'] || [];
        funcs.push(arguments[1]);
    }
};

pico.prototype.signal = pico.signal = function(channelName, events){
    var
    channel = this.slots[channelName],
    mod;
    if (!channel) return;

    for(var key in channel){
        if ('funcs' === key){
            var funcs = channel[key];
            for (var i=0, l=funcs.length; i<l; i++){
                funcs[i].apply(null, events);
            }
        }else{
            mod = pico.modules[key];
            channel[key].apply(mod, events);
        }
    }
};

// add dependency
pico.prototype.use = function(name){ this.deps.push(name);};

// add dependency and link, link = url<parentName, if no parentName link = url
pico.prototype.link = function(name, url){
  this.links[name] = url;
  this.use(name);
};

pico.def = function(name){
    var module, ancestor, factory;

    if (3 === arguments.length){
        // with ancestor
        ancestor = this.modules[arguments[1]];
        factory = arguments[2];
    }else{
        // without ancestor
        factory = arguments[1];
    }
    if (ancestor){
        module = Object.create(ancestor, {moduleName: {value:name, writable:false, configurable:false, enumerable:true}});
        Object.defineProperty(module, 'slots', {value:{}, writable:false, configurable:false, enumerable:false});
        Object.defineProperty(module, 'deps', {value:[], writable:false, configurable:false, enumerable:false});
    }else{
        module = new pico;
        Object.defineProperty(module, 'moduleName', {value:name, writable:false, configurable:false, enumerable:true});
    }
    factory.call(module);
    return this.modules[name] = module;
};

pico.setup = function(names, cb){
    if (!names || !names.length) return cb();

    var module = this.modules[names.pop()];

    this.loadDeps(module, function(){
        module.signal('load');
        pico.setup(names, cb);
    });
};
pico.init = function(config){
    var cfg = this.config;
    for (var key in config){
        cfg[key] = config[key];
    }
    cfg.beatRate = cfg.beatRate || 1000;
    if (pico.states.beatId) clearTimeout(pico.states.beatId);
    pico.states.beatId = setTimeout(pico.onBeat, 1000, pico.config.beatRate, Date.now());
};
pico.detectBrowser = function(){
    var
    browser = 'msie',
    vendor = navigator.vendor,
    userAgent = navigator.userAgent,
    // http://www.quirksmode.org/js/detect.html
    vendorKeys = [{
            string: navigator.userAgent,
            subString: "Chrome",
            identity: "Chrome"
        },{
            string: navigator.userAgent,
            subString: "OmniWeb",
            versionSearch: "OmniWeb",
            identity: "OmniWeb"
        },{
            string: navigator.vendor,
            subString: "Apple",
            identity: "Safari",
            versionSearch: "Version"
        },{
            string: navigator.userAgent,
            subString: "Opera",
            identity: "Opera",
            versionSearch: "Version"
        },{
            string: navigator.vendor,
            subString: "iCab",
            identity: "iCab"
        },{
            string: navigator.vendor,
            subString: "KDE",
            identity: "Konqueror"
        },{
            string: navigator.userAgent,
            subString: "Firefox",
            identity: "Firefox"
        },{
            string: navigator.vendor,
            subString: "Camino",
            identity: "Camino"
        },{
            // for newer Netscapes (6+)
            string: navigator.userAgent,
            subString: "Netscape",
            identity: "Netscape"
        },{
            string: navigator.userAgent,
            subString: "MSIE",
            identity: "Explorer",
            versionSearch: "MSIE"
        },{
            string: navigator.userAgent,
            subString: "Gecko",
            identity: "Mozilla",
            versionSearch: "rv"
        },{
            // for older Netscapes (4-)
            string: navigator.userAgent,
            subString: "Mozilla",
            identity: "Netscape",
            versionSearch: "Mozilla"
        }],
    key;

    for (var i=0, l=vendorKeys.length; i<l; i++){
        key = vendorKeys[i];
        if (-1 !== key.string.indexOf(key.subString)){
            this.states.browser = key.identity;
        }
    }
    if ('Chrome' === this.states.browser || 'Safari' === this.states.browser)
        this.states.isWebKit = true;
};
pico.modState = function(state, name){
    var mod = this.modules[name];

    if (mod) {
        switch(state){
            case 'focus':
                pico.states.moduleName = name;
                pico.signal(state, [{target: mod}]);
                return mod;
            case 'blur':
                pico.signal(state, [{target: mod}]);
                return mod;
            default:
                return null;
        }
    }
    return null;
};

pico.onRoute = function(evt){
    var
    entryPt = this.config.entryPoint,
    newHash = evt.newURL.split('#')[1] || entryPt,
    oldHash = evt.oldURL.split('#')[1] || entryPt;

    if (newHash !== oldHash && this.modState('focus', newHash)){
        this.modState('blur', oldHash);
    }
};

pico.onPageChange = function(evt){
    var
    search = location.search.substring(1), // remove leading ?
    pairs = search.split("&"),
    pair, obj={};
    for (i=0, l=pairs.length; i<l; i++){
        pair = pairs[i].split("=");
        if (!pair[0]) continue;
        obj[pair[0]] = pair[1];
    }
    pico.signal('pageChange', [obj, evt.state]);
};

pico.onBeat = function(delay, startTime){
    var
    outbox = pico.outbox,
    acks = pico.acks,
    outboxKeys = Object.keys(outbox),
    endPos = 0;

    pico.states.beatId = 0;
    pico.signal('beat');

    // post update tasks
    if (outboxKeys.length || acks.length){
        var req = acks.slice(0);
        acks.length = 0;
        outboxKeys.sort();
        for (var i=0, l=outboxKeys.length; i<l; i++){
            req.push(outbox[outboxKeys[i]]);
        }
console.log('req',req);
        pico.ajax('post', pico.config.pushURL, req, null, function(err, xhr){
            // schedule next update
            if (!pico.states.beatId && 4 === xhr.readyState){
                pico.states.beatId = setTimeout(pico.onBeat, delay, delay, Date.now());
            }

            if (err) return console.error(err);

            try{
                var
                json = xhr.responseText.substr(endPos),
                res = JSON.parse(json);
            }catch(exp){
                // incomplete json, return first
                return;
            }
            endPos = xhr.responseText.length;
            if (!res || !res.modelId) return console.error(res);

            model = pico.modules[res.modelId];
            model.sync(res);
            console.log('inbox', res);
        });
    }else{
        pico.states.beatId = setTimeout(pico.onBeat, delay, delay, Date.now());
    }
};

pico.changePage = function(uri, desc, userData){
    var search = '?';
    for (var key in uri){
        if (!key) continue;
        search += key + '=' + uri[key] + '&';
    }
    // remove last & symbol
    history.pushState(userData, desc, search.substr(0, search.length-1));
    if (!this.states.isWebKit){
        this.onPageChange({});
    }
};

pico.changeUIState = function(hash){
    window.location.hash = '#' + hash;
};

pico.loadJS = function(name, parentName, url, cb){
    pico.ajax('get', url, '', null, function(err, xhr){
        if (err) return cb(err);
        if (4 !== xhr.readyState) return;
        var
        func = new Function('module', xhr.responseText),
        module = pico.def(name, parentName, func);

        pico.loadDeps(module, function(){
            module.signal('load');
            return cb(err, module);
        });
    });
};

// recurssively load dependencies in a module
pico.loadDeps = function(host, cb){
  if (!cb) cb = function(){};
  var names = host.deps;
  if (!names || !names.length) return cb();

  var
  name = names.pop(),
  module = this.modules[name];

  if (module){
    host[name] = module;
    return pico.loadDeps(module, function(){
        var mi = pico.states.newModules.indexOf(name);
        if (-1 !== mi){
            module.signal('load');
            pico.states.newModules.splice(mi, 1);
        }
      return pico.loadDeps(host, cb);
    });
  }else{
    var
    arr = host.links[name].split('<'),
    link = arr[0],
    parentName = arr[1];

    if(link){
        pico.loadJS(name, parentName, link, function(err, module){
            if (!err) host[name] = module;
            return pico.loadDeps(host, cb);
        });
    }else{
        return pico.loadDeps(host, cb);
    }
  }
};

pico.embed = function(holder, url, cb){
  pico.ajax('get', url, '', null, function(err, xhr){
    if (err) return cb(err);
    if (4 !== xhr.readyState) return;
    holder.innerHTML = xhr.responseText;

    var scripts = Array.prototype.slice.call(holder.getElementsByTagName('script'));

    pico.embedJS(scripts, function(){
        if (cb) return cb();
    });
  });
};

pico.embedJS = function(scripts, cb){
    if (!scripts || !scripts.length) return cb();

    var script = scripts.pop();

    if (script.getAttribute('templ')) return pico.embedJS(scripts, cb); // template node, ignore
    if (script.src){
      return pico.loadJS([script.getAttribute('name')], script.getAttribute('parent'), script.src, function(err, module){
          return pico.embedJS(scripts, cb);
      });
    }
    var
    func = new Function('module', script.innerText || script.textContent), // secure this operation
    module = pico.def(script.getAttribute('name'), script.getAttribute('parent'), func);

    pico.loadDeps(module, function(){
      module.signal('load');
      return pico.embedJS(scripts, cb);
    });
};

pico.ajax = function(method, url, params, headers, cb, userData){
    if (!url) return cb(new Error('url not defined'));
    var
    xhr = window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP'),
    post = 'post' === method.toLowerCase();

    if (!post && params){
        url += '?'+encodeURI(params);
        params = null;
    }

    xhr.open(method, url, true);
    
    for (var key in headers){
        xhr.setRequestHeader(key, headers[key]);
    }
    if (post && !headers) xhr.setRequestHeader('Content-type', 'application/json');

    xhr.onreadystatechange=function(){
        if (2 < xhr.readyState && cb){
            return cb(200 === xhr.status ? null : new Error("Error["+xhr.statusText+"] Info: "+xhr.responseText), xhr, userData);
        }
    }
    xhr.onerror=function(evt){if (cb) return cb(evt, xhr, userData);}
    xhr.send(params instanceof String ? params : JSON.stringify(params));
};

Object.defineProperty(pico, 'modules', {value:{}, writable:false, configurable:false, enumerable:false});
Object.defineProperty(pico, 'slots', {value:{}, writable:false, configurable:false, enumerable:false});
Object.defineProperty(pico, 'states', {value:{}, writable:false, configurable:false, enumerable:false});
Object.defineProperty(pico, 'config', {value:{}, writable:false, configurable:false, enumerable:false});
Object.defineProperty(pico, 'outbox', {value:{}, writable:true, configurable:false, enumerable:false}); // network outgoing messages, need ack
Object.defineProperty(pico, 'acks', {value:[], writable:true, configurable:false, enumerable:false}); // network outgoing signals, no ack required
Object.defineProperty(pico, 'inner', {value:{
  nn: function(i){
    if (!this._n.length) throw new Error('Nodes not set');
    if (arguments.length) return this._n[i];
    return this._n;
  },
  ii: function(err, obj, Type){ // input to stack
    if (err){
      if (err instanceof Error) throw obj;
      throw new Error(err);
    }
    if (Type && !(obj instanceof Type)) throw new Error('push type mismatch');
    this._s.push(obj);
  },
  oo: function(Type){ // output from stack
    if (!this._s.length) throw new Error('Pop a empty stack');
    var obj = this._s.pop();
    if (Type && !(obj instanceof Type)) throw new Error('pop type mismatch');
    return obj;
  },
  pushArray: function(){ this.ii(null, []); return this; },
  pushAttr: function(attr){ this.ii(null, this.nn(0)[attr]); return this; },
  popAttr: function(attr){
    var
    o = this.oo(),
    nodes = this.nn(),
    node,
    l = nodes.length;
    for(var i=0;i<l;i++) nodes[i][attr] = o;
    return this;
  },
  pushStyle: function(){
    var
    n = this.nn(),
    l = n.length,
    styles = [];
    for(var i=0; i<l; i++) styles.push(n[i].style);
    this.ii(null, styles);
    this.ii(null, CSSStyleDeclaration.prototype.setProperty);
    return this;
  },
  set: function(key, value){
    var
    func = this.oo(Function),
    csss = this.oo(),
    l = csss.length;
    for(var i=0; i<l; i++) func.call(csss[i], key, value);
    return this;
  },
  split: function(delimiter){
    var str = this.oo();
    this.ii(null, str.split(delimiter));
    return this;
  },
  join: function(delimiter){
    var arr = this.oo(Array);
    this.ii(null, arr.join(delimiter));
    return this;
  },
  push: function(obj){
    var list = this.oo(Array);
    if (list.indexOf(obj) < 0) list.push(obj);
    this.ii(null, list);
    return this;
  },
  pop: function(obj){
    var
    list = this.oo(Array),
    i = list.indexOf(obj);
    if (i > 0) list.splice(i, 1);
    this.ii(null, list);
    return this;
  },
  toggle: function(obj){
    var
    list = this.oo(Array), 
    i = list.indexOf(obj);
    if (i < 0) list.push(obj);
    else list.splice(i, 1);
    this.ii(null, list);
    return this;
  },
  toObj: function(){
      var
      obj = {},
      element = this.nn(0);
      switch(element.tagName.toLowerCase()){
          case 'form':
            var objfy = function(fields){
                var field, key, type;

                for(var i=0,l=fields.length; i<l; i++){
                    field = fields[i];
                    key = field.getAttribute('name');
                    if (!key) break;
                    type = field.getAttribute('type');
                    obj[key] = 'number' === type ? parseInt(field.value) : field.value;
                }
            };
            objfy(element.querySelectorAll('input'));
            objfy(element.querySelectorAll('textarea'));
            objfy(element.querySelectorAll('select'));
            break;
      }
      return obj;
  },
  }, writable:false, configurable:false, enumerable:false});

Object.freeze(pico);

window.addEventListener('load', function(){
    pico.detectBrowser();
    pico.changeUIState(pico.config.entryPoint);
    console.log('vendor',navigator.vendor,'userAgent', navigator.userAgent);
    var newModules = pico.states.newModules = Object.keys(pico.modules); // signal load event, if newModules being called in loadDeps
    pico.setup(newModules, function(){
        pico.modState('focus', pico.config.entryPoint);
        pico.signal('load');
    });
});

window.addEventListener('popstate', function(evt){
    pico.onPageChange(evt);
}, false);

window.addEventListener('hashchange', function(evt){
    pico.onRoute(evt);
}, false);
