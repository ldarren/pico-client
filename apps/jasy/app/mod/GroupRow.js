var Router=require('js/Router')

return {
	signals:['cd'],
	events:{
		click:function(e){
			this.select()
			var data=this.deps.data
			if (data.id) Router.go('dir/'+data.id)
			this.signals.cd(data.get('grp'),data.get('name')).send(this.host)
		}
	}
}
