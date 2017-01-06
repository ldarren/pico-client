var
listGrp=function(group){
	if (!group || group.id !== this.dirId) return

	var
	deps=this.deps,
	userIds=group.get('users')

	deps.users.retrieve(userIds,function(err,users){
		if (err) return console.error(err)
		var content=[]
		for(var i=0,id,u; id=userIds[i]; i++){
			u=users.get(id)
			content.push({id:id,name:u.get('name'),icon:'icon_user',type:'f'})
		}

		deps.icons.reset(content)
	})
}

return {
	signals:['header'],
	deps:{
		paneId:'int',
		title:'text',
		btnLeft:'map',
		btnRight:'map',
		cred:'model',
		folder:'model',
		groups:'models',
		users:'models',
		dirId:'param',
		icons:'models'
	},
	create:function(deps){
		if(deps.title)this.signals.header(
			deps.paneId,
			deps.title,
			0===deps.paneId?{icon:'icon_back'}:deps.btnLeft,
			deps.btnRight
		).send(this.host)

		this.dirId=parseInt(deps.dirId)
		
		var gs=deps.groups
		this.listenTo(gs,'add',listGrp)
		listGrp.call(this,gs.get(this.dirId))
	},
	slots:{
		headerButtonClicked:function(from,sender,hash){
			switch(hash){
			case 'address-book':
				break
			}
		}
	}
}
