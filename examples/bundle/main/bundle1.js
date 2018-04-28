const specMgr = require('p/specMgr')

return {
	create(deps, params){
		require('cfg/proj-page1.json', (err, project) => {
			if (err) return console.error(err)
			specMgr.load(null, null, project, (err, spec) => {
				if (err) return console.error(err)
				this.spawnBySpec(spec)
			})
		})
	}
}
