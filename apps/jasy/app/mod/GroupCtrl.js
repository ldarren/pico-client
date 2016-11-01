var
DIR=[{name:'.',icon:'icon_prev',type:'f'},{name:'+',icon:'icon_plus',type:'f'}],
listDir=function(dir,icons){
	var
	content=dir.get('content'),
	dir=DIR.slice()

	for(var i=0,c; c=content[i]; i++){
		dir.push({id:c,icon:'icon_user',type:'d'})
	}

	icons.reset(dir)
}

return {
	signals:['header'],
	deps:{
		paneId:'int',
		title:'text',
		btnLeft:'map',
		btnRight:'map',
		entity:'model',
		groups:'models',
		icons:'models',
		grpName:'text',
		grpParentId:'int'
	},
	create:function(deps){
		if(deps.title)this.signals.header(
			deps.paneId,
			deps.entity.get('name')||deps.title,
			0===deps.paneId?{icon:'icon_back'}:deps.btnLeft,
			deps.btnRight
		).send(this.host)

		this.cwd=[deps.grpParentId,deps.grpName].join('.')

		let
		self=this,
		dir=deps.groups.get(this.cwd)

		if (dir){
			listDir(dir,deps.icons)
		}else{
			deps.groups.read({
				path:this.cwd
			},function(err,model,res){
				listDir(model,deps.icons)
			})
		}
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
