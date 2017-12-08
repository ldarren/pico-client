var Ctrl = inherit('p/Ctrl')
var specMgr = require('p/specMgr')

function styles(csss){
	if (!csss) return csss
	var obj = {}
	for (var i = 0, css; css = csss[i]; i++){
		obj[specMgr.getExtra(css)] = specMgr.getValue(css)	
	}
	return obj
}

function View(name, specRaw, params, host, chains){
	console.log('View',arguments)

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
		opt.content = specMgr.find('html',spec) || opt.content

		var css = specMgr.findAllById('css',spec,true)
		opt.styles = styles(css)

		this.start(opt)

		Ctrl.prototype.initialize.apply(this, arguments)
	},
	remove: function(){
		console.log('View.remove',arguments)
        Ctrl.prototype.remove.call(this)
		this.stop()
	},
	render: function(){
		console.log(this.name,'.render',arguments)
		return this.el
	},
	spawn: function(Mod, params, extraSpec, chains){
		console.log('View.spawn',arguments)
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
		console.log('View.spawnBySpec',arguments)
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
