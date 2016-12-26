return {
	signals:['showLogin'],
	deps:{
		cred:'models'
	},
	events:{
		'click button':function(e){
			switch(e.target.name){
			case 'signin':
				this.signals.showLogin().send(this.host)
				break
			case 'signout':
				this.deps.cred.reset()
				break
			}
		}
	}
}
