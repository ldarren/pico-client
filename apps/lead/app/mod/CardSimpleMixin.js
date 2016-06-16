return {
	deps:{
		lockers:'models'
	},
	slots:{
		lockStatus:function(from, sender, id, state){
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
				var locker=lockers.at(0)

                locker.destroy({
                    data:{
                        lockerId:locker.id,
                        requestId:request.id
                    },
                    success:function(model,raw){
                        self.signals.unlock(model.get('$detail').deviceId,raw.cred).send(self.host)
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
