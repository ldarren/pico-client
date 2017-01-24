var
cd=function(self,dir){
	if (!dir) return
	//TODO: save bandwidth, by comparing directory and groups date, not same fetch then refresh
	var deps=self.deps
	deps.groups.read({ id:dir.id }, function(err,model){
		if (err) return console.error('cd failed')
		console.log('cd suceeded')
		var wd=dir.get('wd')
		deps.credExtra.at(0).set('cwd',wd)
		deps.credential.at(0).set('cwd',wd)
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
			var
			deps=this.deps,
			dir=deps.directory

			if (!dir.length) return
			var d=dir.findWhere({wd:deps.credExtra.at(0).get('cwd')})
			if (!d) return
			cd(this,d)
		},
		cd:function(from,sender,dir){
			if (this.deps.groups.findWhere({id:dir.id})) return
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
