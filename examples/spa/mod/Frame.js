var router = require('po/router')
var specMgr = require('p/specMgr')

function remove(modules){
	if (!modules.length) return
	var p = modules.pop()
	p && p.remove()
	remove(modules)
}

function pageChanged(evt, state, params){
	remove(this.modules)
	var spec = []
	for (var i=0, k; k=state[i]; i++){
		spec.push(this.specMap[k])
	}
	this.spawnBySpec(spec, params)
}

return {
	deps: {
		pages: 'map',
		routes: 'map'
	},
	create: function(deps, params){
		this.super.create.call(this, deps, params)

		var rawSpec = []
		var keys = Object.keys(deps.pages)
		for (var i=0,k; k=keys[i]; i++){
			rawSpec.push(deps.pages[k])
		}

		var specMap = this.specMap = {}
		specMgr.load(this, params, rawSpec, (err, spec)=>{
			for (var i=0, k; k=keys[i]; i++){
				specMap[k]=spec.shift()
			}
			router.on('change',pageChanged,this).start(deps.routes)
		})
	}
}
