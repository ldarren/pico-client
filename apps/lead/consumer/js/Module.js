var ID=0,TYPE=1,VALUE=2,EXTRA=3,
REFS='refs',
specMgr = require('js/specMgr'),
Router = require('js/Router'),
sigslot= require('js/sigslot'),
dummyCB=function(){},
refs=function(id,spec,rawSpec){
    var
    ret={},
    i,s,t
    for(i=0; s=rawSpec[i]; i++){
        if(REFS===s[TYPE] && id===s[ID]){
            t=s[VALUE]
            break
        }
    }
    if (!t) return ret
    for(i=0; s=spec[i]; i++){
        if(t===s[TYPE]){ ret[s[EXTRA]||s[ID]]=s[VALUE] }
    }
    return ret
},
findAll = function(id, list){
    var arr = []
    for(var i=0,o; o=list[i]; i++){ if (id === o[ID]) arr.push(o[VALUE]) }
    return arr
},
specLoaded = function(err, spec, self){
    if (self._removed) return self.remove()
    if (err){
        console.warn(err)
        return Router.home()
    }

    self.spec = spec

    var
    d = {},
    deps = self.deps || {}

    for(var i=0,keys=Object.keys(deps),s,k,v; k=keys[i]; i++){
        v=deps[k]
        v=Array.isArray(v) ? v : [v]
        switch(v[0]){
        case REFS:
            d[k]=refs(k,spec,self._rawSpec)
            break
        default:
            s=findAll(k, spec)
            if (1 === s.length){ d[k]=s[0] }
            else if (!s.length){ d[k]=v[1] }
            else{ d[k] = s }
            break
        }
    }

    self.deps = d
    self.create(d)
    self.signals.moduleAdded(self).send(self.host)

    var h=self.host

    if (h){
        if (self._show) h.show(self, self._show[0], self._show[1])
        if (h._spawnList){
            var
            l=h._spawnList,
            m=l.shift()
            if (!l.length){
                delete h._spawnList
                if(m) m.call(h, null, self)
                return
            }
            h.spawn(m, self._params, null, !self._show)
        }
    }

},
// dun remove mod here, mod may be removed
hideByIndex= function(self, i, host){
    host = host || self.el

    var oldEl = self._elements[i]

    if (oldEl && host.contains(oldEl)){
        host.removeChild(oldEl)
    }
    return oldEl
},
Module= {
    create: function(deps, params){
        var
        spec = this.spec,
        list=[]
        for(var i=0,s; s=spec[i]; i++){
            switch(s[ID]){
            case 'html': this.el.innerHTML=s[VALUE]; break
            case 'el': this.setElement(s[VALUE]); break
            }
            switch(s[TYPE]){
            case 'ctrl': this.spawn(s[VALUE], params); break
            case 'view': list.push(s[VALUE]); break
            }
        }
        this.spawnAsync(list, params, false, dummyCB)
    },
    addSpec: function(rawSpec, cb){
        this._rawSpec=(this._rawSpec||[]).concat(rawSpec)
        specMgr.load(this.host, [], rawSpec, function(err, spec, self){
            if (err) return cb(err)
            self.spec=(self.spec||[]).concat(spec)
            cb(null, spec)
        }, this)
    },
    remove: function(){
        this._removed = true 
        this.off()
        this.stopListening()
        this.dumpAll()
        specMgr.unload(this._rawSpec, this.spec)
    },
    // ctrl can't spawn view
    spawn: function(Mod, params, spec){
        if (!Mod || !Mod.spec) return

        var m = new (Ctrl.extend(Mod.Class))(Mod, spec && spec.length ? Mod.spec.concat(spec) : Mod.spec, params, this)

        this.modules.push(m)

        return m
    },
    // if mixed ctrl and view in _spawnList, all view after ctrl become hidden
    spawnAsync: function(Mods, params, hidden, cb){
        if (!Mods.length) return cb()
        var m=Mods.shift()
        Mods.push(cb)
        this._spawnList=Mods
        return this.spawn(m, params, null, hidden)
    },
    dump: function(mod){
        if (!mod) return -1
        var i = this.modules.indexOf(mod)
        mod.remove()
        this.modules.splice(i, 1)
        return i
    },
    dumpAll:function(){
        var ms=this.modules
        while(ms.length){
            this.dump(ms[0])
        }
    },
    slots:{}
}

function Ctrl(prop, rawSpec, params, host){
    this.name = prop.name
    this.host = host
    this.ancestor = Ctrl.prototype
    this.modules = []
    this._rawSpec = rawSpec
    this._params = params
    this._removed = false 

    this.signals = sigslot(this, ['moduleAdded'])

    specMgr.load(host, params || [], rawSpec, specLoaded, this)
}

Ctrl.extend = Backbone.View.extend

_.extend(Ctrl.prototype, Backbone.Events, Module)

var View = Backbone.View.extend(_.extend(Module, {
    initialize: function(options, prop, spec, params, host, show){
        this._elements = []
        this._show=show?[host.el,false]:null

        Ctrl.call(this, prop, spec, params, host)

        this.ancestor = View.prototype
    },
    remove: function(){
        Ctrl.prototype.remove.call(this)
        Backbone.View.prototype.remove.apply(this, arguments)
    },
    // view can spawn ctrl and view
    spawn: function(Mod, params, spec, hidden){
        if (!Mod || !Mod.spec) return

        if ('ctrl'===Mod.type) return Ctrl.prototype.spawn.call(this, Mod, params, spec)

        var
        s=spec && spec.length ? Mod.spec.concat(spec) : Mod.spec,
        attr

        for(var i=0,a; a=s[i]; i++){
            if ('attributes'===a[ID]){
                attr=a[VALUE]
                break
            }
        }

        var m = new (View.extend(Mod.Class))(attr, Mod, s, params, this, !hidden)

        this.modules.push(m)

        return m
    },
    dump: function(mod){
        var i=Ctrl.prototype.dump.call(this,mod)
        if (i<0) return i
        hideByIndex(this, i)
        this._elements.splice(i, 1)
        return i
    },
    show: function(mod, container, first){
        if (!mod) return
        container = container || this.el
        mod._show=[container, first]

        if (!mod.spec) return mod.el

        var
        i = this.modules.indexOf(mod),
        oldEl = this._elements[i],
        el = mod.render()
        if (el){
            if (container.contains(oldEl)){
                container.replaceChild(el, oldEl)
            }else{
                if (first) container.insertBefore(el, container.firstChild)
                else container.appendChild(el)
            }
            this._elements[i] = el
        }
        return el
    },
    hide: function(mod, host){
        mod._show=null
        return hideByIndex(this,this.modules.indexOf(mod),host)
    },
    render: function(){
        return this.el
    },
    slots:{
        // seldom use, useful only after BB's setElement
        invalidate: this.show
    }
}))

return {
    Ctrl:Ctrl,
    View:View
}
