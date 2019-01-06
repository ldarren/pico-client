var Ctrl = inherit('p/Ctrl')
var specMgr = require('p/specMgr')

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
	Ctrl.apply(this, arguments)

	this.super = View.prototype
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

		Ctrl.prototype.initialize.apply(this, arguments)
	},
	remove: function(){
		Ctrl.prototype.remove.call(this)
		this.stop()
	},
	render: function(){
		return this.el
	},
	spawn: function(Mod, params, extraSpec, chains){
		if (!Mod || !Mod.length) return

		if ('ctrl' === specMgr.getType(Mod)) return Ctrl.prototype.spawn.apply(this, arguments)

		return new (View.extend(specMgr.getExtra(Mod)))(
			specMgr.getId(Mod),
			specMgr.getValue(Mod).concat(extraSpec||[]),
			params,
			this,
			chains instanceof Function ? [chains, extraSpec] : chains
		)
	},
	spawnBySpec: function(spec, params, extraSpec, cb){
		Ctrl.prototype.spawnBySpec.call(
			this,
			spec,
			params,
			extraSpec,
			cb,
			specMgr.findAllByType('view', spec, true)
		)
	}
}

return View
