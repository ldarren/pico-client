var
cwd=function(self){
	var
	deps=self.deps,
	me=deps.cred.at(0)
	if (!me) return
	var
	dir=deps.directory,
	d=dir.findWhere({wd:me.get('cwd')})

	if (!self.currFolder && dir.length){
		if (d) self.signals.cd(d).send()
		else self.signals.cd(dir.at(0)).send() // go to the first dir available
	}
	return d
},
add=function(model){
	if (!this.currFolder) cwd(this)
},
remove=function(model){
	if (this.currFolder===model) cwd(this)
}

return {
	signals:['header','modal_show','cd'],
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
		if (dir) this.slots.cd.call(this,this,this,dir)
		this.listenTo(deps.directory,'add',add)
		this.listenTo(deps.directory,'remove',remove)
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
					// make sure cwd unchanged
					if (self.currFolder && self.currFolder !== model) return
					if (!self.currFolder) this.signals.cd(model).send(self.host)
					self.currFolder=model
					self.deps.folder.add(model)
					console.log('added new group')
				},
				error:function(model,err){
					console.log('failed to add new group',err)
				}
			})
		},
		cd:function(from,sender,f){
			if (this.currFolder === f) return
			this.currFolder=f
			var
			folder=this.deps.folder,
			dir=this.deps.directory,
			grp=f.get('grp'),
			p=grp.lastIndexOf('/')

			folder.set(dir.where({grp:grp}))

			if (-1 !== p) folder.add(dir.find({grp:grp.substr(0,p),name:''}))
		}
	}
}
