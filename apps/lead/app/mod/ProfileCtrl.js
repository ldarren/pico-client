return {
    signals:['refreshcache'],
	deps:{
        owner:'models'
	},
	slots:{
		headerButtonClicked:function(from,sender,hash){
			switch(hash){
			case 'power':
				this.deps.owner.reset()
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
