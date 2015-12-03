var ERR_NOT_FOUND = 'push notification plugin is not available',

return {
    signals: [
        'push_registered',
        'push_unregistered',
        'push_notification',
        'push_error'
    ],
    deps: {
        gcmSenderId: 'text',
        options: ['map',{
            sound:true,
            alert:true,
            badge:true,
            clearNotifications:true,
            clearBadge:true
        }]
    },
    create: function(deps){
        var n= __.refChain(window, ['PushNotification'])

        if (!n) {
            this.slots = {}
            return console.warn(ERR_NOT_FOUND)
        }

        var
        self=this,
        o= deps.options,
        push= this.push=n.init({
            android: {
                senderID:           deps.gcmSenderId,
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

        push.on('registration', function(e){
            self.signals.push_registered(e.registrationId, device.platform, device.model).send()
        })
        push.on('notification', function(e){
            self.signals.push_notification(e).send()

            push.finish(successHnd,errorHnd)
        })
        push.on('error', function(err){
            self.signals.push_error(err).send()
        })
    },
    slots: {
        push_unregister: function(from, sender){
            var self=this
            this.push.unregister(
                function(){
                    self.signals.push_unregistered().send()
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
