return {
	signals:['dialogShow'],
	deps:{
		addRequest:'list'
	},
	slots:{
		headerButtonClicked:function(from,sender,hash){
			this.signals.dialogShow('Add Request',this.deps.addRequest).send(this.host)
		},
		dialogResult:function(from,sender,form){
			console.log(form)
		}
	}
}
