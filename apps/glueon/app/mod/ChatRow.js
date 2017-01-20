var Router=require('js/Router')

return {
	signals:['cd'],
	events:{
		click:function(e){
			this.select()
			var data=this.deps.data
			if (data.id) Router.go('chats/'+data.id)
			this.signals.cd(data).send(this.host)
		}
	}
}
