return {
	deps:{
		lockers:'models'
	},
	slots:{
		lockStatus:function(from, sender, id, state){
			var lock=this.deps.data
			if (id !== lock.$detail.deviceId) return
			var btn=this.el.querySelector('button')
			btn.removeAttribute('disabled')
			switch(state){
			case 'found':
				btn.textContent='Connecting...'
				btn.setAttribute('disabled',1)
				break
			case 'connected':
				btn.textContent='Open'
				break
			case 'disconnected':
				btn.textContent='Scan'
				break
			case 'locked':
				btn.textContent='Open'
				break
			case 'unlocked':
				btn.textContent='Openned'
				btn.setAttribute('disabled',1)
				break
			}
		}
	},
	events:{
		'click button':function(e){
			var lock=this.deps.data

			if (!lock || !lock.$detail || !lock.$detail.deviceId) return __.dialogs.alert('Missing locker information',lock.name)

			var btn=e.srcElement
			switch(btn.textContent){
			case 'Scan':
				this.signals.scan(lock.$detail.deviceId).send(this.host)
				btn.textContent='Scanning...'
				btn.setAttribute('disabled',1)
				break
			case 'Open':
				var
				self=this,
				lockers=this.deps.lockers
				lockers.reset()
                lockers.create(null,{
                    data:{
                        lockerId:lock.id
                    },
                    success:function(model,raw){
                        self.signals.unlock(lock.$detail.deviceId,raw.cred).send(self.host)
                        btn.textContent='Openning...'
                        btn.setAttribute('disabled',1)
                    },
                    error:function(err){
                        console.error(err)
                        btn.textContent='Scan'
                    }
                })
				break
			}
		}
	}
}
