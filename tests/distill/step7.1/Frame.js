var router=require('po/router')
var specMgr= require('p/specMgr')

function pageChanged(evt, state, params){
	var p = this.modules.pop()
	p && p.remove()
	this.spawnBySpec([state], params)
}

return {
	deps:{
		pages:'map',
		env: 'models'
	},
	create: function(deps, params){
		this.super.create.call(this, deps, params)

		var rawSpec = []
		var keys = Object.keys(deps.pages)
		for (var i=0,k; k=keys[i]; i++){
			rawSpec.push(deps.pages[k])
		}
		specMgr.load(this, params, rawSpec, (err, spec)=>{
			var routes={}
			for (var i=0,k; k=keys[i]; i++){
				routes[k] = spec[i]
			}

			router.on('change',pageChanged,this).start(routes)
		})
	}
}
