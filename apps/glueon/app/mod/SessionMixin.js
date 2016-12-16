var network=require('js/network')

return {
	deps:{
		credExtra:'models',
		directory:'models'
	},
	slots:{
		signin:function(from,sender,model){
			this.deps.directory.fetch({
				success:function(){
					debugger
				},
				error:function(){
					debugger
				}
			})
		},
		cd:function(from,sender,dir){
			specMgr.setValue(cwd,dir)
		}
	},
	credential:function(model){
		var
		deps=this.deps,
		extra=deps.credExtra.at(0)
		if(!model)return extra.attributes
		if(model.has('cwd')) return model.attributes
		model.set(extra,{silent:true})
		return model.attributes
	}
}
