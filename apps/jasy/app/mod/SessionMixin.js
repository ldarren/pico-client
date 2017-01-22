var
dummyCB=(err)=>{if (err) return console.error(err)},
cd=function(self,dir,cb){
	if (!dir) return
	cb=cb||dummyCB
	//TODO: save bandwidth, by comparing directory and groups date, not same fetch then refresh
	var deps=self.deps
	deps.groups.read({id:dir.id}, function(err,model,res){
		if (err) return cb(err)
		var wd=dir.wd
		deps.credExtra.at(0).set('cwd',wd)
		deps.credential.at(0).set('cwd',wd)
		cb(null,res)
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
			var deps=this.deps
			cd(this,deps.directory.findWhere({wd:deps.credExtra.at(0).get('cwd')}))
		},
		cd:function(from,sender,dir,cb){
			cd(this,dir,cb)
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
