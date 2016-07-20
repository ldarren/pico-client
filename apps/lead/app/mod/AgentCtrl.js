var Router=require('js/Router')
return {
	signals:['header','modalShow'],
	deps:{
		requests:'models'
	},
	create:function(deps){
		this.signals.header('My Jobs',null,{icon:'icon_search'}).send(this.host)
	},
	slots:{
		headerButtonClicked:function(from,sender,hash){
		},
		requestUpdated:function(from,sender,requestId){
            var req=this.deps.requests.get(requestId)
			req.save(null,{
				data:{
					$detail:form,
					lockerId:form.lockerId
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
