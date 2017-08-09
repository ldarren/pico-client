var router=require('po/router')

return {
	deps:{
		next:'text'
	},
	events:{
		'click button':function(e, target){
			router.go(this.deps.next)
		}
	}
}
