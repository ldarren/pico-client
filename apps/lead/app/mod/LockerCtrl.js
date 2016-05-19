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
					$addr:{street:form.street,city:form.city}
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
