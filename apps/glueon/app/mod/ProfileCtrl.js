var
update=function(){
	var
	deps=this.deps,
	users=deps.users,
	me=deps.cred.at(0),
	up=deps.userProfile,
	name

	this.stopListening(users)

	up.length=0
	if (me && me.id){
		var user=users.get(me.id)
		if (user){
			name=user.get('name')
			up.push({model:'owner',props:[me.id,'name'],label:'Name'})
			up.push({type:'button',name:'signout',label:'Sign out'})
			deps.owner.set(user)
		}else{
			this.listenTo(users,'add',update)
		}
	}else{
		up.push({type:'button',name:'signin',label:'Sign in'})
		deps.owner.reset()
	}
	if(deps.title)this.signals.header(
		deps.paneId,
		name||deps.title,
		0===deps.paneId?{icon:'icon_back'}:deps.btnLeft,
		deps.btnRight
	).send(this.host)
}

return{
	signals:['header','showLogin'],
	deps:{
		paneId:'int',
		title:'text',
		btnRight:'map',
		cred:'models',
		users:'models',
		owner:'models',
		userProfile:'list'
	},
	create: function(deps){
		update.call(this)
    },
	slots:{
		userReady:function(from,sender,model){
			update.call(this)
		},
		signout:function(from,sender){
			update.call(this)
		}
	}
}
