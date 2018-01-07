var STD_SIGNALS=['moduleAdded']
var REFS='refs'
var Module=inherit('po/Module')
var specMgr = require('p/specMgr')
var sigslot= require('p/sigslot')

function refs(id,spec,rawSpec){
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
}

function specLoaded(err, spec, params, userData){
	console.log('Ctrl.specLoaded',arguments)
	var self = userData[0]
	var host = self.host

	host.modules && host.modules.push(self)

	self.initialize(spec, params)

	var _el = self._el
	if (_el){
		host.el && !_el.parentElement && host.el.appendChild(_el)
		self.el = self.render()
	}

	var chains = userData[1]

	if (!chains) return
	if (2 === chains.length) {
		var cb = chains[0]
		return cb && cb()
	}
	host.spawn(chains.shift(), params, chains[chains.length-1], chains)
}

function Ctrl(name, specRaw, params, host, chains){
	console.log('Ctrl',arguments)
	Module.call(this, name)

	this._specRaw = specRaw
	this.host = host
	this.modules = []
	this.super = Ctrl.prototype
    this.signals = sigslot.create(this, STD_SIGNALS)

	specMgr.load(host, params||[], specRaw, specLoaded, [this, chains])
}

Ctrl.prototype = {
	initialize: function(spec, params, cb){
	    console.log('Ctrl.initialize',arguments)
		this.spec = spec

		var deps = {}
		var d = this.deps || {}

		for(var i=0,keys=Object.keys(d),s,k,v; k=keys[i]; i++){
			v=d[k]
			v=Array.isArray(v) ? v : [v]
            switch(v[0]){
            case REFS:
                deps[k]=refs(k,spec,self._specRaw)
                break
			case 'ctrl':
			case 'view':
                deps[k]=specMgr.find(k, spec, true)
				break
            default:
                s=specMgr.findAllById(k, spec)
                if (1 === s.length){ deps[k]=s[0] }
                else if (!s.length){ deps[k]=v[1] }
                else{ deps[k] = s }
                break
            }
		}
		this.deps = deps

		this.create(deps, params, cb)
	},
	create: function(deps, params, cb){
		console.log('Ctrl.create',arguments)
		this.spawnBySpec(this.spec, params, [], cb)
	},
	remove: function(){
		console.log('Ctrl.remove',arguments)
		var ms = this.modules
		for (var i=0,m; m=ms[i]; i++){
			m.remove()
		}
		ms.length = 0
		this.deps = this.spec = this._specRaw = void 0
	},
	spawn: function(Mod, params, extraSpec, chains){
		console.log('Ctrl.spawn',arguments)
		if (!Mod || !Mod.length) return

		return new (Ctrl.extend(specMgr.getExtra(Mod)))(
			specMgr.getId(Mod),
			specMgr.getValue(Mod).concat(extraSpec||[]),
			params,
			this,
			chains instanceof Function ? [chains, extraSpec] : chains
		)
	},
	spawnBySpec: function(spec, params, extraSpec, cb, list){
		console.log('Ctrl.spawnBySpec',arguments)
		list = (list || []).concat(specMgr.findAllByType('ctrl', spec, true))
		if (!list.length) return  cb && cb()
		list.push(cb, extraSpec)
		return this.spawn(list.shift(), params, extraSpec, list)
	},
	slots: {
	}
}

return Ctrl
