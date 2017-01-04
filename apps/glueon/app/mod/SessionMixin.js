var
network=require('js/network'),
cd=function(self,d){
	var deps=self.deps
	deps.directory.fetch({
		data:{
			d:d
		},
		success:function(){
			deps.credExtra.at(0).set({cwd:d})
			deps.credential.at(0).set({cwd:d})
		},
		error:function(){
			debugger
		}
	})
}

return {
	deps:{
		directory:'models',
		credExtra:'models'
	},
	slots:{
		userReady:function(from,sender,model){
			cd(this,'')
		},
		cd:function(from,sender,dir){
			if (this.deps.directory.findWhere({grp:dir})) return
			cd(this,dir)
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
