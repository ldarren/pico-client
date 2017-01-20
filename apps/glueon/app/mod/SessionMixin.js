var
network=require('js/network'),
poll=function(self,grp,name){
	//TODO: save bandwidth, by comparing directory and groups date, not same fetch then refresh
	var deps=self.deps
	deps.directory.fetch({
		data:{
			grp:grp,
			name:name
		},
		success:function(coll,res){
			console.log('poll dir suceeded')
		},
		error:function(coll,err){
			console.error('poll dir failed',err)
			debugger
		}
	})
},
cd=function(self,dir){
	//TODO: save bandwidth, by comparing directory and groups date, not same fetch then refresh
	var deps=self.deps
	deps.groups.fetch({
		data:{
			id:dir.id
		},
		success:function(coll,res){
			console.log('cd suceeded')
			var wd=dir.get('wd')
			deps.credExtra.at(0).set('cwd',wd)
			deps.credential.at(0).set('cwd',wd)
		},
		error:function(coll,err){
			console.error('cd failed',err)
			debugger
		}
	})
},
search=function(self,grp){
	if (!grp) return
	var deps=self.deps
	deps.search.fetch({
		data:{ grp:grp },
		success:function(coll,res){
			console.log('search suceeded')
			deps.directory.add(res)
		},
		error:function(coll,err){
			console.error('search failed',err)
			debugger
		}
	})
}

return {
	deps:{
		groups:'models',
		directory:'models',
		credExtra:'models',
		searchDir:'text',
		search:'models'
	},
	slots:{
		userReady:function(from,sender,model){
			poll(this,'','')
			search(this,this.deps.searchDir) //TODO: move this to create once anonymous user is ready
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
