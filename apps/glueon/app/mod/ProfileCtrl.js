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
		var
		me=deps.cred.at(0),
		up=deps.userProfile,
		name
		if (me){
			var user=deps.users.get(me.id)
			name=user.get('name')
			deps.owner.set(user)
			up.push({model:'owner',field:1,value:'name',label:'Name'})
			up.push({type:'button',name:'signup',label:'Sign up'})
		}else{
			up.push({type:'button',name:'signin',label:'Sign in'})
		}
		if(deps.title)this.signals.header(
			deps.paneId,
			name||deps.title,
			0===deps.paneId?{icon:'icon_back'}:deps.btnLeft,
			deps.btnRight
		).send(this.host)
	},
	slots:{
		headerButtonClicked:function(from,sender,hash){
			switch(hash){
			case 'power':
				this.signals.showLogin().send(this.host)
				break
			}
		}
    }
}
