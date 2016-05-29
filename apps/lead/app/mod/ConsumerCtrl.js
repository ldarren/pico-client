var Router=require('js/Router')
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
			if (!this.deps.lockers.length) 
				return __.dialogs.alert(
					'You need a locker to add request',
					'No locker found',
					'Add locker',
					function(){ 
						Router.go('locker')
					}
			)
			this.signals.modalShow('Add Request',this.deps.addRequest).send(this.host)
		},
		modalResult:function(from,sender,form){
			this.deps.requests.create(null,{
				data:{
					$detail:form,
					lockerId:parseInt(form.lockerId)
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
