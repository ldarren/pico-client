return {
	signals:['dialogShow'],
	deps:{
		requests:'models',
		addRequest:'list'
	},
	slots:{
		headerButtonClicked:function(from,sender,hash){
			this.signals.dialogShow('Add Request',this.deps.addRequest).send(this.host)
		},
		dialogResult:function(from,sender,form){
			this.deps.requests.create(form,{
				data:form,
				wait:true
			})
		}
	}
}
