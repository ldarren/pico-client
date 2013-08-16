pico = function(n){
  if (n){
    return Object.create(pico.inner,
      {
        _s: {writable:false, configurable:false, enumerable:false, value:[]},   // stack
        _n: {writable:false, configurable:false, enumerable:false, value:       // node list
        (n instanceof Element) ? [n] : Array.prototype.slice.call(document.querySelectorAll(n))}
      });
  }
  return this;
};
// shared by all pico objects
pico.prototype.links = {};

pico.prototype.slot = pico.slot = function(channelName){
    var channel = this.slots[channelName] = this.slots[channelName] || {};
    if (3 === arguments.length){
        channel[arguments[1].moduleName] = arguments[2];
    }else{
        // function only no object
        var func = arguments[1];
        channel[pico.hash(func.toString())] = func;
    }
};
pico.prototype.unslot = pico.unslot = function(channelName, identity){
    var channel = this.slots[channelName] = this.slots[channelName] || {};
    if (identity.moduleName){
        delete channel[identity.moduleName];
    }else{
        // function only no object
        delete channel[pico.hash(identity.toString())];
    }
};
pico.prototype.signal = pico.signal = function(channelName, events){
    var
    channel = this.slots[channelName],
    mod;
    if (!channel) return;

    for(var key in channel){
        mod = pico.modules[key];
        channel[key].apply(mod, events);
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
    if (this.modules[name]) return console.error('Module name in used:', name);
    var module, ancestor, factory;

    if (3 === arguments.length){
        // with ancestor
        ancestor = this.modules[arguments[1]];
        factory = arguments[2];
    }else{
        // without ancestor
        factory = arguments[1];
    }
    var properties = {
        moduleName: {value:name, writable:false, configurable:false, enumerable:true},
        slots: {value:{}, writable:false, configurable:false, enumerable:false},
        deps: {value:[], writable:false, configurable:false, enumerable:false}
    };
    if (ancestor){
        module = Object.create(ancestor, properties);
    }else{
        module = Object.create(pico.prototype, properties);
    }
    // each pico object has their own slots and dependencies

    factory.call(module);
    return this.modules[name] = module;
};
pico.getModule = function(key){
    return this.modules[key];
};
pico.setup = function(names, cb){
    if (!names || !names.length) return cb();

    var module = this.modules[names.shift()];

    this.loadDeps(module, function(){
        module.signal(pico.LOAD);
        pico.setup(names, cb);
    });
};
pico.loadJS = function(name, parentName, url, cb){
    pico.ajax('get', url, '', null, function(err, xhr){
        if (err) return cb(err);
        if (4 !== xhr.readyState) return;
        var
        func = new Function('module', xhr.responseText),
        module = pico.def(name, parentName, func);

        pico.loadDeps(module, function(){
            module.signal(pico.LOAD);
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
            pico.states.newModules.splice(mi, 1);
            module.signal(pico.LOAD);
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

    if (script.type && -1 === script.type.indexOf('javascript')) return pico.embedJS(scripts, cb); // template node, ignore
    if (script.src){
      return pico.loadJS([script.getAttribute('name')], script.getAttribute('parent'), script.src, function(err, module){
          return pico.embedJS(scripts, cb);
      });
    }
    var
    func = new Function('module', script.innerText || script.textContent), // secure this operation
    module = pico.def(script.getAttribute('name'), script.getAttribute('parent'), func);

    pico.loadDeps(module, function(){
      module.signal(pico.LOAD);
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
            var st = xhr.status;
            return cb(
                (200 === st || !st) ? null : new Error("Error["+xhr.statusText+"] Info: "+xhr.responseText),
                xhr,
                userData);
        }
    }
    xhr.onerror=function(evt){if (cb) return cb(evt, xhr, userData);}
    xhr.send(params instanceof String ? params : JSON.stringify(params));
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
    var
    search = location.search.substring(1), // remove leading ?
    pairs = search.split("&"),
    pair, obj={};
    for (i=0, l=pairs.length; i<l; i++){
        pair = pairs[i].split("=");
        if (!pair[0]) continue;
        obj[pair[0]] = pair[1];
    }
    pico.signal(pico.STATE_CHANGE, [obj, evt.state]);
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
pico.onHashChange = function(evt){
    var
    newHash = evt.newURL.split('#')[1] || '',
    oldHash = evt.oldURL.split('#')[1] || '';

    pico.signal(pico.HASH_CHANGE, [oldHash, newHash]);
};
pico.changeHash = function(hash){
    window.location.hash = '#' + hash;
};
// query = tag#id
pico.addFrame = function(holder, query, url){
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
pico.changeFrame = function(holder, query, url, effects){
    var
    frame = holder.querySelector(query),
    te = this.states.transitionEnd;

    if (!frame || !te) return this.addFrame(holder, query, url);

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
            return console.error('invalid effect:',value);
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

Object.defineProperty(pico, 'LOAD', {value:'load', writable:false, configurable:false, enumerable:true});
Object.defineProperty(pico, 'STATE_CHANGE', {value:'stateChange', writable:false, configurable:false, enumerable:true});
Object.defineProperty(pico, 'HASH_CHANGE', {value:'hashChange', writable:false, configurable:false, enumerable:true});

Object.defineProperty(pico, 'modules', {value:{}, writable:false, configurable:false, enumerable:false});
Object.defineProperty(pico, 'slots', {value:{}, writable:false, configurable:false, enumerable:false});
Object.defineProperty(pico, 'states', {value:{}, writable:false, configurable:false, enumerable:false});
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
  }
  }, writable:false, configurable:false, enumerable:false});

if (!Object.freeze) Object.freeze = function(){};
Object.freeze(pico);

window.addEventListener('load', function(){
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
    states = pico.states,
    key;

    for (var i=0, l=vendorKeys.length; i<l; i++){
        key = vendorKeys[i];
        if (-1 !== key.string.indexOf(key.subString)){
            states.browser = key.identity;
        }
    }
    if ('Chrome' === states.browser || 'Safari' === states.browser) states.isWebKit = true;

    var
    te = 'transitionend',
    wkte = 'webkittransitionend';

    states.transitionEnd = pico.detectEvent(te) ? te : pico.detectEvent(wkte) ? 'webkitTransitionEnd' : undefined;

    var newModules = pico.states.newModules = Object.keys(pico.modules); // signal load event, if newModules being called in loadDeps
    pico.setup(newModules, function(){
        pico.signal(pico.LOAD);
    });
});

window.addEventListener('popstate', function(evt){
    // change uri parameter
    pico.onStateChange(evt);
}, false);
window.addEventListener('hashchange', function(evt){
    pico.onHashChange(evt);
}, false);
