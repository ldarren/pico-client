var
network=require('js/network'),
cd=function(self,grp,name){
	//TODO: save bandwidth, by comparing directory and groups date, not same fetch then refresh
	var deps=self.deps
	deps.groups.fetch({
		data:{
			grp:grp,
			name:name
		},
		success:function(coll,res){
			var wd=res.wd
			deps.credExtra.at(0).set('cwd',wd)
			deps.credential.at(0).set('cwd',wd)
		},
		error:function(){
			debugger
		}
	})
}

return {
	deps:{
		groups:'models',
		directory:'models',
		credExtra:'models'
	},
	slots:{
		userReady:function(from,sender,model){
			cd(this,'','')
		},
		cd:function(from,sender,grp,name){
			if (this.deps.directory.findWhere({grp:dir})) return
			cd(this,grp,name)
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
