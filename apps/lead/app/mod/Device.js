return {
    signals:['push_register'],
	deps:{
		push:'ctrl',
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
		push_registered:function(from, sender, token){
			this.deps.devices.create(null,{
				data:{
					token:token,
					os:device.platform.toLowerCase(),
					model:device.model.toLowerCase()
				}
			})
		},
		push_unregistered:function(){
		},
		push_notification:function(){
		},
		push_error:function(){
		}
	}
}
