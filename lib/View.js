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
	if (err) return console.error(err)

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

function style(csss){
	if (!csss) return csss
	var obj = {}
	for (var i = 0, css; (css = csss[i]); i++){
		obj[specMgr.getExtra(css)] = specMgr.getValue(css)
	}
	return obj
}

function setContentToFirstChild(opt, content){
	if (!content) return
	if (Array.isArray(opt.content)) return setContentToFirstChild(opt.content[0], content)
	opt.content = content
}

function View(name, specRaw, params, host, chains){
	Module.call(this, name)

	this._specRaw = specRaw
	this.host = host
	this.modules = []
	this.super = View.prototype
	sigslot.create(this, STD_SIGNALS)

	host && specMgr.load(host, params||null, specRaw, specLoaded, [this, chains])
}

View.prototype = {
	initialize: function(spec, params, cb){
		var opt = specMgr.getViewOptions(spec)
		// view must contain an options
		if (!opt){
			opt = {}
			spec.push(['options','map',opt])
		}
		// override content with html spec if any
		setContentToFirstChild(opt, specMgr.find('html',spec))

		var css = specMgr.findAllById('css',spec,true)
		opt.style = style(css)

		this.start(opt)

		this.spec = spec

		var deps = {}
		var d = this.deps || {}

		for(var i=0,keys=Object.keys(d),s,k,v; (k=keys[i]); i++){
			v=d[k]
			v=Array.isArray(v) ? v : [v]
			switch(v[0]){
			case REFS:
				deps[k]=refs(k,spec,this._specRaw)
				break
			case 'view':
				deps[k]=specMgr.nearest(k, this, true)
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
		sigslot.remove(this)
		this.clear()
		this.deps = this.spec = this._specRaw = void 0
		this.stop()
	},
	clear: function(){
		var ms = this.modules
		for (var i=0,m; (m=ms[i]); i++){
			m.remove()
		}
		ms.length = 0
	},
	render: function(){
		return this.el
	},
	spawn: function(Mod, params, extraSpec, chains){
		if (!Mod || !Mod.length) return

		return new (View.extend(specMgr.getExtra(Mod)))(
			specMgr.getId(Mod),
			(extraSpec||[]).concat(specMgr.getValue(Mod)),
			params,
			this,
			chains instanceof Function ? [chains, extraSpec] : chains
		)
	},
	spawnBySpec: function(spec, params, extraSpec, cb, list){
		list = (list || []).concat(specMgr.findAllByType('view', spec, true))
		if (!list.length) return  cb && cb()
		list.push(cb, extraSpec)
		return this.spawn(list.shift(), params, extraSpec, list)
	},
	slots: {
	},
}

return View
