return {
	signals:['header','modalShow'],
	deps:{
		lockers:'models',
		addLocker:'list'
	},
	create:function(deps){
		this.signals.header('My Lockers',{icon:'icon_plus'},{icon:'icon_search'}).send(this.host)
	},
	slots:{
		headerButtonClicked:function(from,sender,hash){
			this.signals.modalShow(this.deps.addLocker).send(this.host)
		},
        pageCreate:function(from,sender,index,total,form,cb){
			cb('Add Locker',form)
        },
        pageResult:function(from,sender,result,cb){
            this.result=result
            cb()
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
