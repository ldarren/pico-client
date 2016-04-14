var ID=0,TYPE=1,VALUE=2,EXTRA=3,
REFS='refs',
specMgr = require('js/specMgr'),
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
specLoaded = function(err, spec, userData){
    var
    self=userData[0],
    spawnList=userData[1]

    if (self._removed) return self.remove()
    if (err){
		__.dialogs.alert(err, 'Load Error')
        return console.warn(err)
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
            s=specMgr.findAllById(k, spec)
            if (1 === s.length){ d[k]=s[0] }
            else if (!s.length){ d[k]=v[1] }
            else{ d[k] = s }
            break
        }
    }

    self.deps = d
    self.create(d)

    var h=self.host
    self.signals.moduleAdded().send(h)

    if (h){
        if (self._show) h.show(self, self._show[0], self._show[1])
        if (spawnList){
            var m=spawnList.shift()
            if (1===spawnList.length){
				spawnList.length=0
                if(m) m.call(h, null, self)
                return
            }
            h.spawn(m, self._params, spawnList[spawnList.length-1], !self._show, spawnList)
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
        this.spawnAsync(list, params, null, false, dummyCB)
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
    spawn: function(Mod, params, spec, chains){
        if (!Mod || !Mod.spec) return
		if (chains instanceof Function){
		}

        var m = new (Ctrl.extend(Mod.Class))(
			Mod,
			spec && spec.length ? Mod.spec.concat(spec) : Mod.spec,
			params,
			this,
			chains instanceof Function ? [chains, spec] : chains)

        this.modules.push(m)

        return m
    },
    spawnAsync: function(Mods, params, spec, hidden, cb){
        if (!Mods.length) {
			if (cb) cb()
			return
		}
        var m=Mods.shift()
        Mods.push(cb)
		Mods.push(spec)
        return this.spawn(m, params, spec, hidden, Mods)
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

function Ctrl(prop, rawSpec, params, host, chains){
    this.name = prop.name
    this.host = host
    this.ancestor = Ctrl.prototype
    this.modules = []
    this._rawSpec = rawSpec
    this._params = params
    this._removed = false 

    this.signals = sigslot(this, ['moduleAdded'])
    specMgr.load(host, params || [], rawSpec, specLoaded, [this,chains])
}

Ctrl.extend = Backbone.View.extend

_.extend(Ctrl.prototype, Backbone.Events, Module)

var View = Backbone.View.extend(_.extend(Module, {
    initialize: function(options, prop, spec, params, host, show, chains){
        this._elements = []
        this._show=show?[host.el,false]:null

        Ctrl.call(this, prop, spec, params, host, chains)

        this.ancestor = View.prototype
    },
    remove: function(){
        Ctrl.prototype.remove.call(this)
        Backbone.View.prototype.remove.apply(this, arguments)
    },
    // view can spawn ctrl and view
    spawn: function(Mod, params, spec, hidden, chains){
        if (!Mod || !Mod.spec) return

        if ('ctrl'===Mod.type) return Ctrl.prototype.spawn.call(this, Mod, params, spec, chains)

        var s=spec && spec.length ? Mod.spec.concat(spec) : Mod.spec

        for(var i=0,o; o=s[i]; i++){ if ('options'===o[ID]) break }

        var m = new (View.extend(Mod.Class))(
			o?o[VALUE]:o,
			Mod,
			s,
			params,
			this,
			!hidden,
			chains instanceof Function ? [chains,spec]:chains)
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
            el.dataset.viewName=mod.name
			mod.rendered()
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
	rendered: function(){
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
