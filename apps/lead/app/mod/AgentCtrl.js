var Router=require('js/Router')
return {
	signals:['modalShow'],
	deps:{
		requests:'models'
	},
	create:function(deps){
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
