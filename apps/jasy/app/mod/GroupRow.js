var Router=require('js/Router')

return {
	events:{
		click:function(e){
			this.select()
			Router.go('dir/'+this.deps.data.id)
		}
	}
}
