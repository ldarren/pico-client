var Ctrl = inherit('p/Ctrl')
var specMgr = require('p/specMgr')

function View(name, specRaw, params, host, chains){
	console.log('View',arguments)

	var opt = specMgr.getViewOptions(specRaw)
	// view must contain an options
    if (!opt){
        opt = {}
        specRaw.push(['options','map',opt])
    }
	// override content with html spec if any
	opt.content = specMgr.find('html',specRaw) || opt.content

    Ctrl.apply(this, arguments)

	this.super = View.prototype
}

View.prototype = {
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
