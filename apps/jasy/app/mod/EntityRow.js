var Router=require('js/Router')

return {
	events:{
		click:function(e){
			this.select()
			Router.go('entity/'+this.deps.data.id)
		}
	}
}
