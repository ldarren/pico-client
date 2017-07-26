var router=require('po/router')

return {
	create: function(deps, params){
		this.count = params ? params.id || 0 : 0
		this.el.textContent = 'Page'+this.count
	},
	events:{
		'click':function(e, target){
			var c = this.count
			if (++c > 1) c = 0
			router.go('page/'+c)
		}
	}
}
