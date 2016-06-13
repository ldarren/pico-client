return {
    signals:['refreshcache','powerDown'],
	deps:{
	},
	slots:{
		headerButtonClicked:function(from,sender,hash){
			switch(hash){
			case 'power':
				this.signals.powerDown().send()
				break
			case 'restart':
				window.location.reload(true)
				break
			case 'reload':
				this.signals.refreshCache().send()
				break
			}
		}
	}
}
