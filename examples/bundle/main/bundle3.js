const specMgr = require('p/specMgr')

return {
	create(deps, params){
		require('cfg/proj-page3.json', (err, project) => {
			if (err) return console.error(err)
			specMgr.load(null, null, project, (err, spec) => {
				if (err) return console.error(err)
				this.clear()
				this.spawnBySpec(spec)
			})
		})
	}
}
