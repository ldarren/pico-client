const specMgr = require('p/specMgr')
const project = require('cfg/proj-page3.json')

return {
	create(deps, params){
		specMgr.load(null, null, project, (err, spec) => {
			if (err) return console.error(err)
			this.clear()
			this.spawnBySpec(spec)
		})
	}
}
