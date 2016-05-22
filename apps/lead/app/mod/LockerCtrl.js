return {
	signals:['modalShow'],
	deps:{
		lockers:'models',
		addLocker:'list'
	},
	slots:{
		headerButtonClicked:function(from,sender,hash){
			this.signals.modalShow('Add Locker',this.deps.addLocker).send(this.host)
		},
		modalResult:function(from,sender,form){
			this.deps.lockers.create(null,{
				data:{
					name:form.name,
					$detail:{street:form.street,city:form.city,deviceId:form.deviceId}
				},
				wait:true,
				success:function(){
					debugger
				},
				error:function(){
					debugger
				}
			})
		}
	}
}
