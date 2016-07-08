var
Router=require('js/Router'),
pTime=require('pico/time')

return {
	deps:{
		contacts:'models'
	},
	events:{
		'click':function(e){
			var c=this.deps.contacts.get(this.deps.data.get('contactId'))
			Router.go('callout/'+c.id)
		}
	},
	parseData:function(data,cb){
		var c=this.deps.contacts.get(data.contactId)
		return cb(null, {name:c.get('name'), day:pTime.day(new Date(data.id))})	
	}
}
