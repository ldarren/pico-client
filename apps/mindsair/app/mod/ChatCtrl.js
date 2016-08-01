return {
	signals:['hideChat'],
	deps:{
		showByDefault:['bool',false]
	},
	create:function(deps){
		var layer0=document.querySelector('#mindsair #layer0')
		this.layer0=layer0.classList
		if (deps.showByDefault) this.layer0.remove('hidden')
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
