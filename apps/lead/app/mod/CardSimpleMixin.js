return {
	deps:{
		lockers:'models'
	},
	slots:{
		lockStatus:function(from, sender, id, state){
				debugger
			var lockers=this.deps.lockers
			if (!lockers.length) return
			if (id !== lockers.at(0).get('$detail').deviceId) return
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
				debugger
			var
			self=this,
			deps=this.deps,
			lockers=deps.lockers,
			request=deps.data

			if (!request || !request.$detail || !request.$detail.lockerId) return __.dialogs.alert('Missing locker information',request.id)

			var btn=e.srcElement
			switch(btn.textContent){
			case 'Scan':
				lockers.reset()
				lockers.create(null,{
					data:{
						lockerId:request.$detail.lockerId,
						requestId:request.id
					},
					success:function(model){
						self.signals.scan(model.get('$detail').deviceId).send(self.host)
						btn.textContent='Scanning...'
						btn.setAttribute('disabled',1)
					}
				})
				break
			case 'Open':
				if (!lockers.length) break
				var
                locker=lockers.at(0),
                lockerId=locker.id,
                deviceId=locker.get('$detail').deviceId

                lockers.remove(locker,{
                    data:{
                        lockerId:lockerId,
                        requestId:request.id
                    },
                    success:function(model,raw){
                        this.signals.unlock(deviceId,raw.cred).send(this.host)
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
