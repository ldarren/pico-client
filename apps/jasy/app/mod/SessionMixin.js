var network=require('js/network')

return {
	deps:{
		credExtra:'models'
	},
	slots:{
		signin:function(from,sender,model){
			this.deps.credential.at(0).set({cwd:model.id.toString()})
		},
		cd:function(from,sender,dir){
			var deps=this.deps
			deps.credExtra.at(0).set({cwd:dir})
			deps.credential.at(0).set({cwd:dir})
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
