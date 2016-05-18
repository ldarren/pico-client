return {
	signals:['modalShow'],
	deps:{
		locks:'models',
		addLock:'list'
	},
	slots:{
		headerButtonClicked:function(from,sender,hash){
			this.signals.modalShow('Add Lock',this.deps.addLock).send(this.host)
		},
		modalResult:function(from,sender,form){
			this.deps.locks.create(null,{
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
