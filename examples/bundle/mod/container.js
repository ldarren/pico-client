const specMgr = require('p/specMgr')

return {
  deps: {
  },
  create(deps, params){
  },
  events: {
  	'click a': function(evt, target){
		require('cfg/proj-' + target.name + '.json', (err, project) => {
			if (err) return console.error(err)
			specMgr.load(null, null, project, (err, spec) => {
				if (err) return console.error(err)
				this.clear()
				this.spawnBySpec(spec)
			})
		})
	}
  }
}
