return {
    signals:['push_register','push_unregister'],
	deps:{
		push:'ctrl',
		owner:'models',
		devices:'models'
	},
	create:function(deps){
        if (!__.refChain(window, ['device'])) {
            this.slots = {}
            return console.warn('Device plugin is not available')
        }
		this.push=this.spawn(deps.push)
	},
	slots:{
        signin:function(from, sender, user){
            this.signals.push_register().send(this.push)
        },
        powerDown:function(from, sender){
            this.signals.push_unregister().send(this.push)
        },
		push_registered:function(from, sender, token){
			this.deps.devices.create(null,{
				data:{
					token:token,
					os:device.platform.toLowerCase(),
					uuid:device.uuid,
					$detail:{
						sw:device.cordova,
						os:device.version,
						hw:device.manufacturer+':'+device.model,
						sim:device.isVirtual
					}
				}
			})
		},
		push_unregistered:function(){
			var
			ds=this.deps.devices,
			d=ds.at(0)
			ds.remove(d,{
				data:{
					deviceId:d.id
				}
			})
			this.deps.owner.reset()
		},
		push_notification:function(){
		},
		push_error:function(){
		}
	}
}
