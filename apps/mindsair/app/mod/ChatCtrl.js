return {
	signals:['header','hideChat'],
	deps:{
		showByDefault:['bool',false],
		paneId:'int',
		title:'text',
		btnLeft:'map',
		btnRight:'map'
	},
	create:function(deps){
		var layer0=document.querySelector('#mindsair #layer0')
		this.layer0=layer0.classList
		if (deps.showByDefault) this.layer0.remove('hidden')
		if(deps.title)this.signals.header(deps.paneId,deps.title,deps.btnLeft,deps.btnRight).send(this.host)
	},
	slots:{
		showChat:function(from,sender){
			this.layer0.remove('hidden')
		},
		headerButtonClicked:function(from,sender,hash){
			switch(hash){
			case 'ko':
				this.layer0.add('hidden')
				this.signals.hideChat().send(this.host)
				break
			}
		}
	}
}
