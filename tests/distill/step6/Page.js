var router=require('po/router')

return {
	deps:{
		path:'text'
	},
	create:function(deps,params){
		console.log('create page',deps.path)
	},
	slots:{
		click:function(from,sender,name){
			router.go(this.deps.path)
		}
	}
}
