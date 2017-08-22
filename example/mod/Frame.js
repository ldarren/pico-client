var router = require('po/router')
var specMgr = require('p/specMgr')
var specMap = null

function pageChanged(evt, state, params){
	var p = this.modules.pop()
	p && p.remove()
	var spec = []
	for (var i=0, k; k=state[i]; i++){
		spec.push(specMap[k])
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

		specMap = {}
		var rawSpec = []
		var keys = Object.keys(deps.pages)
		for (var i=0,k; k=keys[i]; i++){
			rawSpec.push(deps.pages[k])
		}
		specMgr.load(this, params, rawSpec, (err, spec)=>{
			for (var i=0, k; k=keys[i]; i++){
				specMap[k]=spec.pop()
			}
			router.on('change',pageChanged,this).start(deps.routes)
		})
	}
}
