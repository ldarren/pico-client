var
Module = require('Module'),
notifier = 'Phonegap' === pico.getEnv('browser') ? window.plugins.pushNotification : null,
onGSM = function(self, name){
    window[name] = function(e){
        switch( e.event ) {
        case 'registered':
            if ( e.regid.length > 0 ) {
                console.log("regID = " + e.regid);
            }
            break;
        case 'message':
            if ( e.foreground ) {
                var soundfile = e.soundname || e.payload.sound;
                var my_media = new Media("/android_asset/www/"+ soundfile);
                my_media.play();
            } else if ( e.coldstart ) {
                // coldstart
            } else {
                // background
            }

            console.log('gcm payload:'+JSON.stringify(e.payload))
            break;
        case 'error':
            console.error('gsm err:'+e.msg)
            break;
        default:
            console.error('gsm unknown:'+JSON(e))
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
            notifier.setApplicationIconBadgeNumber(
                function(result){
                    console.log('apn:'+result)
                },
                function(error){
                    console.error('apn err:'+error)
                },
                e.badge)
        }
        console.log('apn payload:'+JSON.stringify(e))
    }
}

exports.Class = Module.Class.extend({
    create: function(spec){
        if (!notifier) return
        this.register(device.platform.toLowerCase())
    },
    render(): function(){},
    moduleEvents: function(evt, sender){
        if (!notifier) return
        switch(evt){
        case 'userReady':
            break
        }
    },
    register: function(platform){
        var ecb = this.require('callback').value || 'onNotifier'+this.id
        switch(platform){
        case 'android':
        case 'amazon-fireos':
            onGSM(this, ecb)
            notifier.register(
                this.successHnd,
                this.errorHnd,
                {
                    senderID:this.require('gcmSenderId').value
                    ecb:ecb
                }
            )
            break
        default:
            onAPN(this, ecb)
            notifier.register(
                this.tokenHnd,
                this.errorHnd,
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
    successHnd = function(result){
        console.log('notifier ok: '+result)
    },
    errorHnd = function(error){
        console.log('notifier ko: '+error)
    },
    tokenHnd = function(token){
        console.log('apn token: '+token)
    }
})
