pico = function(n){
  if (n){
    return Object.create(pico.inner,
      {
        _s: {writable:false, configurable:false, enumerable:false, value:[]},
        _n: {writable:false, configurable:false, enumerable:false, value: 
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

pico.prototype.slot = pico.slot = function(channel, listener, cb){
  var channel = this.slots[channel] = this.slots[channel] || {};
  channel[listener.moduleName] = cb;
};

pico.prototype.signal = pico.signal = function(channel, events){
    var
    channel = this.slots[channel],
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
    pico.setup(names, cb);
  });
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
    newHash = evt.newURL.split('#')[1] || this.ENTRY_POINT,
    oldHash = evt.oldURL.split('#')[1] || this.ENTRY_POINT;

    if (newHash !== oldHash && this.modState('focus', newHash)){
        this.modState('blur', oldHash);
    }
};

pico.onBeat = function(){
    var
    inbox = pico.inbox,
    outbox = pico.outbox,
    value;

    // pre update tasks
    for (var i=0, l=inbox.length; i<l; i++){
        value = inbox[i];
        consol.log('inbox', i, value);
    }

    pico.signal('beat');

    // post update tasks
    for (var key in outbox){
        value = outbox[key];
        consol.log('outbox', key, value);
    }
};

pico.loadJS = function(name, parentName, url, cb){
    pico.ajax('get', url, '', null, function(err, xhr){
        if (err) return cb(err);
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
    holder.innerHTML = xhr.responseText;

    var scripts = Array.prototype.slice.call(holder.getElementsByTagName('script'));

    pico.embedJS(scripts, function(){
        if (cb) return cb();
    });
  });
};

pico.embedJS = function(scripts, cb){
    if (!scripts || !scripts.length) return cb();

    var
    script = scripts.pop(),
    func, module;

    if (script.getAttribute('templ')) return pico.embedJS(scripts, cb); // template node, ignore
    if (script.src){
      pico.loadJS([script.getAttribute('name')], script.getAttribute('parent'), script.src, function(err, module){
          return pico.embedJS(scripts, cb);
      });
    }
    func = new Function('module', script.innerText);
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
        if (4 === xhr.readyState){
            if (cb)
              return cb(200 === xhr.status ? null : new Error("Error["+xhr.statusText+"] Info: "+xhr.responseText), xhr, userData);
        }
    }
    xhr.onerror=function(evt){if (cb) return cb(evt, xhr, userData);}
    xhr.send(params instanceof String ? params : JSON.stringify(params));
};

Object.defineProperty(pico, 'modules', {value:{}, writable:false, configurable:false, enumerable:false});
Object.defineProperty(pico, 'slots', {value:{}, writable:false, configurable:false, enumerable:false});
Object.defineProperty(pico, 'ENTRY_POINT', {value:'entryPoint', writable:false, configurable:false, enumerable:false});
Object.defineProperty(pico, 'states', {value:{}, writable:false, configurable:false, enumerable:false});
Object.defineProperty(pico, 'inbox', {value:[], writable:true, configurable:false, enumerable:false}); // network incoming messages
Object.defineProperty(pico, 'outbox', {value:{}, writable:true, configurable:false, enumerable:false}); // network outgoing messages
Object.defineProperty(pico, 'inner', {value:{
  nn: function(i){
    if (!this._n.length) throw new Error('Nodes not set');
    if (arguments.length) return this._n[i];
    return this._n;
  },
  ii: function(err, obj, Type){
    if (err){
      if (err instanceof Error) throw obj;
      throw new Error(err);
    }
    if (Type && !(obj instanceof Type)) throw new Error('push type mismatch');
    this._s.push(obj);
  },
  oo: function(Type){
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
  }, writable:false, configurable:false, enumerable:false});

Object.freeze(pico);

window.addEventListener('load', function(){
  pico.setup(Object.keys(pico.modules), function(){
      pico.modState('focus', pico.ENTRY_POINT);
      pico.signal('load');
  });
});

window.addEventListener('hashchange', function(evt){
    pico.onRoute(evt);
}, false);

window.setInterval(function(){
    pico.onBeat();
}, 1000);
