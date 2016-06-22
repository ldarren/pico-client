return {
    signals:['refreshcache','powerDown'],
	deps:{
	},
	slots:{
		headerButtonClicked:function(from,sender,hash){
            var self=this
			switch(hash){
			case 'power':
                __.dialogs.confirm('Do you really want to sign out?','D2D',['Sign out','Cancel'],function(btn){
				    if (1===btn) self.signals.powerDown().send()
                })
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
