// require com.phonegap.plugins.PushPlugin
// require org.apache.cordova.device
var
Module = require('Module'),
notifier = 'phonegap' === pico.getEnv('browser') ? window.plugins.pushNotification : null,
successHnd = function(result){
    console.log('ok: '+result)
},
errorHnd = function(error){
    console.error('ko: '+error)
},
onGSM = function(self, name){
    window[name] = function(e){
        switch( e.event ) {
        case 'registered':
            if ( e.regid ) {
                self.user.save(null, {
                    data:{
                        dataId:self.user.id,
                        platform:'gcm',
                        pushToken:e.regid
                    }
                })
            }
            break;
        case 'message':
            if ( e.foreground ) {
                var soundfile = e.soundname || e.payload.sound;
                var my_media = new Media("/android_asset/www/"+ soundfile);
                my_media.play();
            } else if ( e.coldstart ) {
                // coldstart
                console.error('gcm coldstart')
            } else {
                // background
                console.error('gcm background')
            }

            console.log('gcm payload:'+JSON.stringify(e.payload))
            break;
        case 'error':
            console.error('gcm err:'+e.msg)
            break;
        default:
            console.error('gcm unknown:'+JSON(e))
            break;
        }
    }
},
onAPN = function(self, name){
    window[name] = function(e){
        if ( e.alert ) {
            navigator.notification.alert(e.alert)
        }
        if ( e.sound ) {
            (new Media(e.sound)).play()
        }
        if ( e.badge ) {
            notifier.setApplicationIconBadgeNumber( successHnd, errorHnd, e.badge)
        }
        console.log('apn payload:'+JSON.stringify(e))
    }
}

exports.Class = Module.Class.extend({
    create: function(spec){
    },
    render: function(){},
    moduleEvents: function(evt, sender){
        if (!notifier) return
        switch(evt){
        case 'userReady':
            this.user = arguments[2]
            this.register(device.platform.toLowerCase())
            break
        case 'signout':
            this.unregister()
            break
        }
    },
    register: function(platform){
        var
        self = this,
        ecb = (this.require('callback').value || 'onNotifier')+this.id
        switch(platform){
        case 'android':
        case 'amazon-fireos':
            onGSM(this, ecb)
            notifier.register(
                successHnd,
                errorHnd,
                {
                    senderID:this.require('gcmSenderId').value,
                    ecb:ecb
                }
            )
            break
        default:
            onAPN(this, ecb)
            notifier.register(
                function(token){
                    self.user.save(null, {
                        data:{
                            dataId:self.user.id,
                            platform:'apn',
                            pushToken:token
                        }
                    })
                },
                errorHnd,
                {
                    'badge':'true',
                    'sound':'true',
                    'alert':'true',
                    'ecb':ecb
                }
            )
            break
        }
    },
    unregister: function(){
        notifier.unregister(successHnd, errorHnd)
    }
})
