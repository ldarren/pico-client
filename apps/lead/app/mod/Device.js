return {
	deps:{
		push:'ctrl',
		devices:'models'
	},
	create:function(deps){
        if (!__.refChain(window, ['device'])) {
            this.slots = {}
            return console.warn('Device plugin is not available')
        }
		this.spawn(deps.push)
	},
	slots:{
		push_registered:function(from, sender, token){
			self.deps.devices.create(null,{
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
