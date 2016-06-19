var
COLORS=['purple','green','orange','red'],
STATES=['Cancelled','Order placed','Collected','Delivered'],
picoTime=require('pico/time')

return {
	deps:{
		lockers:'models',
		users:'models'
	},
    parseData:function(data, cb){
		var
        deps=this.deps,
        detail=data.$detail,
        lockerId=detail.lockerId

        var locker=deps.lockers.get(lockerId)
        if (!locker) return cb('Invalid lockerId:'+lockerId)
        var user=deps.users.get(data.cby)
        if (!user) return cb('Invalid userId:'+data.cby)

        var
        dt=new Date(detail.collect),
        t=dt.toLocaleTimeString()

        return cb(null, {
            COLORS:COLORS,
            STATES:STATES,
            jobState:data.s,
            jobCollectDate:picoTime.day(dt),
            jobCollectTime:t.substring(0, t.indexOf('M')+1),//remove time zone
            type:detail.type,
            locker:locker.get('$detail'),
            userName:user.get('name'),
            user:user.get('$detail')
        })
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
