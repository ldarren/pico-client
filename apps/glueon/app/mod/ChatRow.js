var Router=require('js/Router')

return {
	events:{
		click:function(e){
			this.select()
			var data=this.deps.data
			switch(data.get('type')){
			case 'group':
				Router.go('group/'+data.id)
				break
			default:
				Router.go('entity/'+data.id)
				break
			}
		}
	}
}
