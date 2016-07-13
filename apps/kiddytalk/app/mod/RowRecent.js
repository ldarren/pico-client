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
		var
		c=this.deps.contacts.get(data.contactId),
		date=new Date(data.id),
		day=pTime.day(date)

		if ('Today'===day) day=date.toLocaleTimeString()
		return cb(null, {name:c.get('name'), day:day})	
	}
}
