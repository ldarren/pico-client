var STD_SIGNALS=['moduleAdded']
var Module=inherit('po/Module')
var specMgr = require('p/specMgr')
var sigslot= require('p/sigslot')

function specLoaded(err, spec, params, userData){
	console.log('View.specLoaded',arguments)
	var self = userData[0]
	var chains = userData[1]

	self.initialize(spec, params)

	if (!chains) return
	if (2 === chains.length) {
		var cb = chains[0]
		return cb && cb()
	}
	
	self.host.spawn(chains.shift(), params, chains[chains.length-1], chains)
}

function View(name, specRaw, params, host, chains){
	console.log('View',arguments)
	Module.call(this, name)

	this._specRaw = specRaw
	this.host = host
	this.modules = []
	this.super = View.prototype
    this.signals = sigslot.create(this, STD_SIGNALS)

	var opt = specMgr.getViewOptions(specRaw)||{}
	opt.content = specMgr.find('html',specRaw)
	this.start(opt,specMgr.find('css',specRaw))

	specMgr.load(host, params||[], specRaw, specLoaded, [this, chains])
}

View.prototype = {
	initialize: function(spec, params, cb){
		this.spec = spec

		var deps = {}
		var d = this.deps || {}

		for(var i=0,keys=Object.keys(d),s,k,v; k=keys[i]; i++){
			v=d[k]
			v=Array.isArray(v) ? v : [v]
			s=specMgr.findAllById(k, spec)
			if (1 === s.length){ deps[k]=s[0] }
			else if (!s.length){ deps[k]=v[1] }
			else{ deps[k] = s }
		}
		this.deps = deps

		this.create(deps, params, cb)
	},
	create: function(deps, params, cb){
		console.log('View.create',arguments)
		this.spawnBySpec(this.spec, params, [], cb)
	},
	remove: function(){
		console.log('View.remove',arguments)
		this.deps = this.spec = this._specRaw = void 0
	},
	render: function(){
		console.log('View.render',arguments)
		return this.el
	},
	rendered: function(){
	},
	spawn: function(Mod, params, extraSpec, chains){
		if (!Mod || !Mod.spec) return

		var m = new (View.extend(Mod.Class))(
			Mod.name,
			Mod.spec.concat(extraSpec),
			params,
			this,
			chains instanceof Function ? [chains, extraSpec] : chains
		)
		var newEl = m.render()
		!newEl.parentElement && this.el.appendChild(newEl)
		this.rendered()

		this.modules.push(m)

		return m
	},
	spawnBySpec: function(spec, params, extraSpec, cb){
		var list = specMgr.findAllByType('view', spec)
		if (!list.length) return  cb && cb()
		list.push(cb, extraSpec)
		return this.spawn(list.shift(), params, extraSpec, list)
	}
}

return View
