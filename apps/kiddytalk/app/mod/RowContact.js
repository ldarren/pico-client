var Router=require('js/Router')

return {
	events:{
		'click':function(e){
			Router.go('callout/'+this.deps.data.id)
		}
	}
}
