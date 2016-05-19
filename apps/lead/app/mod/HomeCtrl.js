return {
	signals:['modalShow'],
	deps:{
		requests:'models',
		lockers:'models',
		addRequest:'list'
	},
	create:function(deps){
		for(var i=0,fs=deps.addRequest,f,o; f=fs[i]; i++){
			if ('select'===f.type){
				o=f.options
				o.length=0
				for(var j=0,ls=deps.lockers,l;l=ls.at(j); j++){
					o.push([l.id,l.get('name')])
				}
				break
			}
		}
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
