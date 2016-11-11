var
DIR=[{id:'.',icon:'icon_prev',type:'f'},{id:'+',icon:'icon_plus',type:'f'}],
listDir=function(dir,icons){
	var
	content=dir.get('d'),
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
		directory:'models',
		icons:'models',
		group:'text'
	},
	create:function(deps){
		if(deps.title)this.signals.header(
			deps.paneId,
			deps.entity.get('name')||deps.title,
			0===deps.paneId?{icon:'icon_back'}:deps.btnLeft,
			deps.btnRight
		).send(this.host)

		this.cwd=deps.group

		let
		self=this,
		dir=deps.directory.get(this.cwd)

		if (dir){
			listDir(dir,deps.icons)
		}else{
			deps.directory.read({
				cwd:this.cwd
			},function(err,model,res){
				if (err) return __.dialogs.alert('failed to list directory "'+this.cwd+'"')
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
