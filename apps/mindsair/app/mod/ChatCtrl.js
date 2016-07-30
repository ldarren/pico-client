return {
	signals:['hideChat'],
	deps:{
	},
	create:function(deps){
		var layer0=document.querySelector('#mindsair #layer0')
		this.layer0=layer0.classList
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
