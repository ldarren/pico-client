var
ERR_NOT_FOUND = 'push notification plugin is not available',
listeners=function(self){
	self.push.on('registration', function(e){
		self.signals.push_registered(e.registrationId).send()
	})
	self.push.on('notification', function(e){
		self.signals.push_notification(e).send()

		self.push.finish(successHnd,errorHnd)
	})
	self.push.on('error', function(err){
		self.signals.push_error(err).send()
	})
}

return {
    signals: [
        'push_registered',
        'push_unregistered',
        'push_notification',
        'push_error'
    ],
    deps: {
        gcmSenderId: 'text',
		devices:'models',
        options: ['map',{
            sound:true,
            alert:true,
            badge:true,
            clearNotifications:true,
            clearBadge:true
        }]
    },
    create: function(deps){
        if (!__.refChain(window, ['PushNotification'])) {
            this.slots = {}
            return console.warn(ERR_NOT_FOUND)
        }
    },
    slots: {
		push_register:function(){
			var
			self=this,
			o=this.deps.options

			this.push=PushNotification.init({
				android: {
					senderID:           self.deps.gcmSenderId,
					sound:              o.sound,
					//vibrate:            o.vibrate, // ios no vibration?
					icon:               o.icon,
					iconColor:          o.iconColor,
					clearNotifications: o.clearNotifications,
					forceShow:          o.forceShow
				},
				ios: {
					alert:      o.alert,
					badge:      o.badge,
					sound:      o.sound,
					clearBadge: o.clearBadge
				}, 
				windows: {} 
			})
			listeners(self, self.deps.devices)
		},
        push_unregister: function(from, sender){
            var self=this
            this.push.unregister(
                function(){
                    self.signals.push_unregistered().sendNow()
                },
                function(error){
                    self.signals.push_error(error).send()
                })
        },
        push_setBadge: function(from, sender, n, cb){
            this.push.setApplicationIconBadgeNumber(cb, cb, n)
        },
        push_getBadge: function(from, sender, cb){
            this.push.getApplicationIconBadgeNumber(function(n){
                cb(null, n)
            }, cb)
        }
    }
}
