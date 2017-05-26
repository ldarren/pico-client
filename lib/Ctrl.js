var
ID=0,TYPE=1,VALUE=2,EXTRA=3,
REFS='refs',
STD_SIGNALS=['moduleAdded'],
Module=inherit('po/Module'),
specMgr = require('p/specMgr'),
sigslot= require('p/sigslot'),
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
    chains=userData[1]

    if (self._removed) return self.remove()
    if (err){
		__.dialogs.alert(err.error, 'Load Error')
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
    self.initialize(d,self.params)
    self.delegateEvents()

    var h=self.host
    self.signals.moduleAdded().send(h)

    if (h){
        if (self._show && self.show) h.show(self, self._show[0], self._show[1])
        if (chains){
            var m=chains.shift()
            if (1===chains.length){
				chains.length=0
                if(m) m.call(h, null, self)
                return
            }
            h.spawn(m, self.params, chains[chains.length-1], !self._show, chains)
        }
    }
}

function Ctrl(prop, rawSpec, params, host, show, chains){
	Module.call(this)
	this.super=Ctrl.prototype
    this.name = prop.name
    this.host = host
    this.modules = []
    this.params = params
    this._rawSpec = rawSpec
    this._removed = false 
    this._show=show?[host.el,false]:null // view in chains migh need to show

    this.signals = sigslot.create(this, STD_SIGNALS)
    specMgr.load(host, params || [], rawSpec, specLoaded, [this,chains])
}

Ctrl.prototype = {
	initialize: function(){
		this.create.apply(this,arguments);
	},
    create: function(deps, params, hidden, cb){
        var
		el=this.el,
		spec = this.spec

		if(el){ // ctrl has no el
			if (deps.html) el.innerHTML=deps.html
			else for(var i=0,s; s=spec[i]; i++) if('html'===s[ID]){ el.innerHTML=s[VALUE]; break }
		}
        this.spawnAsync(spec, params, null, hidden, cb || dummyCB)
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
        this.dumpAll()
        specMgr.unload(this._rawSpec, this.spec)
        this.stop()
    },
    // ctrl can't spawn view
    spawn: function(Mod, params, spec, hidden, chains){
        if (!Mod || !Mod.spec) return

        var m = new (Ctrl.extend(Mod.Class))(
			Mod,
			spec && spec.length ? Mod.spec.concat(spec) : Mod.spec,
			params,
			this,
            !hidden,
			chains instanceof Function ? [chains, spec] : chains)

        this.modules.push(m)

        return m
    },
    spawnAsync: function(Mods, params, spec, hidden, cb){
        var list=[]
        for(var i=0,m; m=Mods[i]; i++){
            switch(m[TYPE]){
            case 'ctrl': 
            case 'view': list.push(m[VALUE]); break
            }
        }
        if (!list.length) {
			if (cb) cb()
			return
		}
        list.push(cb,spec)
        return this.spawn(list.shift(), params, spec, hidden, list)
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

return Ctrl
