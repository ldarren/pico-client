return{
	signals:['header','showLogin'],
	deps:{
		paneId:'int',
		title:'text',
		btnRight:'map',
		cred:'models',
		users:'models',
		owner:'models'
	},
	create: function(deps){
		if(deps.title)this.signals.header(
			deps.paneId,
			deps.title,
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
