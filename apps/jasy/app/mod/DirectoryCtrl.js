var
cwd=function(self){
	var
	deps=self.deps,
	me=deps.cred.at(0)
	if (!me) return
	return deps.directory.findWhere({wd:me.get('cwd')})
}

return {
	signals:['header','modal_show'],
	deps:{
		paneId:'int',
		title:'text',
		btnLeft:'map',
		btnRight:'map',
		directory:'models',
		folder:'models',
		cred:'models',
		newGroupForm:'list'
	},
	create:function(deps){
		if(deps.title)this.signals.header(deps.paneId,deps.title,deps.btnLeft,deps.btnRight).send(this.host)
		
		var dir=cwd(this)
		if (!dir) return

		this.slots.cd.call(this,this,this,dir.get('grp'),'')
	},
	slots:{
		headerButtonClicked:function(from,sender,hash){
			var o=this.deps.cred.at(0)
			if (!o || !o.id) return __.dialogs.alert('You need to confirm your email first','Not signin')
			switch(hash){
			case 'plus':
				this.signals.modal_show([this.deps.newGroupForm]).send(this.host)
				break
			}
		},
		modal_pageCreate:function(from,sender,curr,total,form,cb){
			cb('New Group',form)
		},
		modal_result:function(from,sender,result){
			var
			self=this,
			$public={
				desc:result.desc
			},
			$private={
			},
			data={
				name:result.name,
				$public:$public,
				$private:$private
			}

			this.deps.directory.create(null,{
				data:data,
				wait:true,
				success:function(model,res){
					var dir=cwd(self)
					if (!dir) return
					var grp=dir.get('grp')
					// make sure grp unchanged
					if (self.grp && self.grp !== grp) return
					self.grp=grp
					self.deps.folder.add(model)
					console.log('added new group')
				},
				error:function(model,err){
					console.log('failed to add new group',err)
				}
			})
		},
		cd:function(from,sender,grp,name){
			if (this.grp === grp) return
			this.grp=grp
			var
			folder=this.deps.folder,
			dir=this.deps.directory,
			p=grp.lastIndexOf('/')

			folder.set(dir.where({grp:this.grp}))

			if (-1 !== p) folder.add(dir.find({grp:grp.substr(0,p),name:''}))
		}
	}
}
