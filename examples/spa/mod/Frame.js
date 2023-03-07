var router = require('po/router')
var specMgr = require('p/specMgr')

function pageChanged(evt, payload, params){
	this.clear()
	var spec = []
	for (var i=0, k; (k=payload[i]); i++){
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
		for (var i=0,k; (k=keys[i]); i++){
			rawSpec.push(deps.pages[k])
		}

		var specMap = this.specMap = {}
		specMgr.load(this, params, rawSpec, (err, spec)=>{
			for (var i=0, k; (k=keys[i]); i++){
				specMap[k]=spec.shift()
			}
			router.on('change',pageChanged,this).start(deps.routes)
		})
	}
}
