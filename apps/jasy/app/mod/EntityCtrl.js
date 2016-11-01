return {
	signals:['header'],
	deps:{
		paneId:'int',
		title:'text',
		btnLeft:'map',
		btnRight:'map',
		entity:'model'
	},
	create:function(deps){
		if(deps.title)this.signals.header(
			deps.paneId,
			deps.entity.get('name')||deps.title,
			0===deps.paneId?{icon:'icon_back'}:deps.btnLeft,
			deps.btnRight
		).send(this.host)
	},
	slots:{
		headerButtonClicked:function(from,sender,hash){
			switch(hash){
			case 'edit':
				break
			}
		}
	}
}
