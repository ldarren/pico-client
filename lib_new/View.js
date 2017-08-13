var Ctrl = inherit('p/Ctrl')
var specMgr = require('p/specMgr')

function View(name, specRaw, params, host, chains){
	console.log('View',arguments)

	var opt = specMgr.getViewOptions(specRaw)
    if (!opt){
        opt = {}
        specRaw.push(['options','map',opt])
    }
	opt.content = specMgr.find('html',specRaw)

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
		if (!Mod || !Mod.spec) return

        if ('ctrl' === Mod.type) return Ctrl.prototype.spawn.apply(this, arguments)

		return new (View.extend(Mod.Class))(
			Mod.name,
			Mod.spec.concat(extraSpec||[]),
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
            specMgr.findAllByType('view', spec)
        )
	}
}

return View
