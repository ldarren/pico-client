const specMgr = require('p/specMgr')

return {
	events: {
		'click a': function(evt, target){
			require(target.name, (err, bundle) => {
				if (err) return __.dialogs.alert(err)
				this.clear()
				this.spawn(specMgr.create(target.name, 'view', [], bundle))
			})
		}
	}
}
