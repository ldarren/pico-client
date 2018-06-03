const specMgr = require('p/specMgr')
const project = require('cfg/proj-page1.json')

return {
	create(deps, params){
		specMgr.load(null, null, project, (err, spec) => {
			if (err) return console.error(err)
			this.spawnBySpec(spec)
		})
	}
}
