var STD_SIGNALS=['moduleAdded']
var REFS='refs'
var Module=inherit('po/Module')
var specMgr = require('p/specMgr')
var sigslot= require('p/sigslot')

function refs(id,spec,rawSpec){
	var ret={}
	var i,s,t,l
	for(i=0, l=rawSpec.length; i < l; i++){
		if (!(s = rawSpec[i])) continue
		if(REFS===specMgr.getType(s) && id===specMgr.getId(s)){
			t=specMgr.getValue(s)
			break
		}
	}
	if (!t) return ret
	for(i=0, l=spec.length; i < l; i++){
		if (!(s = spec[i])) continue
		if(t===specMgr.getType(s)){
			ret[specMgr.getExtra(s)||specMgr.getId(s)]=specMgr.getValue(s)
		}
	}
	return ret
}

function specLoaded(err, spec, params, userData){
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
	Module.call(this, name)

	this._specRaw = specRaw
	this.host = host
	this.modules = []
	this.super = Ctrl.prototype
	this.signals = sigslot.create(this, STD_SIGNALS)

	host && specMgr.load(host, params||null, specRaw, specLoaded, [this, chains])
}

Ctrl.prototype = {
	initialize: function(spec, params, cb){
		this.spec = spec

		var deps = {}
		var d = this.deps || {}

		for(var i=0,keys=Object.keys(d),s,k,v; (k=keys[i]); i++){
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
				if (1 === s.length){
					deps[k]=s[0]
				} else if (!s.length){
					deps[k]=v[1]
				} else{
					deps[k] = s
				}
				break
			}
		}
		this.deps = deps

		this.create(deps, params, cb)
	},
	create: function(deps, params, cb){
		this.spawnBySpec(this.spec, params, [], cb)
	},
	remove: function(){
		sigslot.remove(this.signals)
		this.clear()
		this.signals = this.deps = this.spec = this._specRaw = void 0
	},
	clear: function(){
		var ms = this.modules
		for (var i=0,m; (m=ms[i]); i++){
			m.remove()
		}
		ms.length = 0
	},
	spawn: function(Mod, params, extraSpec, chains){
		if (!Mod || !Mod.length) return

		return new (Ctrl.extend(specMgr.getExtra(Mod)))(
			specMgr.getId(Mod),
			(extraSpec||[]).concat(specMgr.getValue(Mod)),
			params,
			this,
			chains instanceof Function ? [chains, extraSpec] : chains
		)
	},
	spawnBySpec: function(spec, params, extraSpec, cb, list){
		list = (list || []).concat(specMgr.findAllByType('ctrl', spec, true))
		if (!list.length) return  cb && cb()
		list.push(cb, extraSpec)
		return this.spawn(list.shift(), params, extraSpec, list)
	},
	slots: {
	}
}

return Ctrl
