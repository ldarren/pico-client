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
		chats:'models',
		dialogues:'models',
		cred:'models',
		newGroupForm:'list'
	},
	create:function(deps){
		if(deps.title)this.signals.header(deps.paneId,deps.title,deps.btnLeft,deps.btnRight)
			.run([function(evt,args,next){console.log(1);next(evt,args)},function(evt,args,next){console.log(2);next(evt,args)}])
			.run(function(evt,args,next){console.log(3);next(evt,args)})
			.send(this.host)
		
		var dir=cwd(this)
		if (dir) this.slots.cd.call(this,this,this,dir.get('grp'),'')
		else if (deps.cred.length) this.slots.cd.call(this,this,this,deps.cred.at(0).get('cwd'),'')
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
					var
					dir=cwd(self),
					grp=dir?dir.get('grp'):res.grp // for anonymouse user, dir could be undefined
					// make sure grp unchanged
					if (self.grp && self.grp !== grp) return
					self.grp=grp
					self.deps.dialogues.add(model)
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
			dialogues=this.deps.dialogues,
			dir=this.deps.directory,
			p=grp.lastIndexOf('/')

			dialogues.set(dir.where({grp:this.grp}))

			if (-1 !== p) dialogues.add(dir.find({grp:grp.substr(0,p),name:''}))
		}
	}
}