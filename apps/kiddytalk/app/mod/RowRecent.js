return {
	deps:{
		contacts:'models'
	},
	parseData:function(data,cb){
		var c=this.deps.contacts.get(data.contactId)
		return cb(null, {name:c.name, datetime:data.datetime})	
	}
}
