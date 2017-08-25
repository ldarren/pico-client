var router=require('po/router')

return {
	events:{
		'click button':function(e, target){
			router.go(target.textContent)
		}
	}
}
