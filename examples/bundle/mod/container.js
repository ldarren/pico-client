const specMgr = require('p/specMgr')

return {
  events: {
  	'click a': function(evt, target){
		require(target.name, (err, bundle) => {
			this.clear()
			if (err) console.error(err)
			this.spawn([target.name, 'view', [], bundle])
		})
	}
  }
}
