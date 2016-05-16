return {
	signals:['modalShow'],
	deps:{
		requests:'models',
		addRequest:'list'
	},
	slots:{
		headerButtonClicked:function(from,sender,hash){
			this.signals.modalShow('Add Request',this.deps.addRequest).send(this.host)
		},
		modalResult:function(from,sender,form){
			this.deps.requests.create(null,{
				data:{
					$case:form
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
