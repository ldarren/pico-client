var
ERR_NOT_FOUND = 'local notification plugin is not available',
ERR_PARAMS = 'invalid local notification schedule params',
currId = Math.ceil(Math.random()*999),
setup = function(self, n, ln){
    self.notifier= n
    self.localNotifier = ln
    // click or trigger on notification
    ln.on('trigger', trigger, self)
    ln.on('click', click, self)
},
scheduler = function(self, ln, notis, sender){
    if (!notis || !notis.length) return
    var n = notis.shift()
    if (!n || !n.text) return scheduler(self, ln, notis, sender)
    n.id = currId++
    n.title = n.title || self.deps.title
    ln.schedule(n, function(){ self.signals.notifier_scheduled(this).send(sender) },n.id)
    scheduler(self, ln, notis, sender)
},
trigger = function(noti){ this.signals.notifier_trigger(noti).send(this.host) },
click = function(noti){ this.signals.notifier_click(noti).send(this.host) },
register= function(self, platform){
    var 
    ecb = '$_notifiercb_$'
    switch(platform){
    case 'android':
    case 'amazon-fireos':
        onGSM(self, ecb)
        self.notifier.register(
            console.log,
            function(error){
                self.signals.notifier_registered(error).send()
            },
            {
                senderID:self.deps.gcmSenderId,
                ecb:ecb
            }
        )
        break
    default:
        onAPN(self, ecb)
        self.notifier.register(
            function(token){
                self.signals.notifier_registered(null, token, platform).send()
            },
            function(error){
                self.signals.notifier_registered(error).send()
            },
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
unregister= function(self){
    self.notifier.unregister(
        function(){
            self.signals.notifier_unregistered().send()
        },
        function(error){
            self.signals.notifier_unregistered(error).send()
        })
},
onGSM = function(self, name){
    window[name] = function(e){
        switch( e.event ) {
        case 'registered':
            self.signals.notifier_registered(null, e.regid, platform).send()
            break;
        case 'message':
            if ( e.foreground ) {
                var soundfile = e.soundname || e.payload.sound;
                if (soundfile){
                    var my_media = new Media("/android_asset/www/"+ soundfile);
                    my_media.play();
                }else{
                    navigator.notification.beep(1)
                }
            } else if ( e.coldstart ) {
                // coldstart
            } else {
                // background
            }

            console.log('gcm payload:'+JSON.stringify(e.payload))
            navigator.notification.vibrate(1000)
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
            //navigator.notification.alert(e.alert)
        }
        if ( e.sound ) {
            (new Media(e.sound)).play()
        }else{
            navigator.notification.beep(1)
        }
        if ( e.badge ) {
            self.notifier.setApplicationIconBadgeNumber( console.log, console.error, e.badge)
        }
        navigator.notification.vibrate(1000)
        console.log('apn payload:'+JSON.stringify(e))
    }
}

return {
    signals: [
        'notifier_registered',
        'notifier_unregistered',
        'notifier_trigger',
        'notifier_triggered',
        'notifier_click',
        'notifier_scheduled',
        'notifier_updated',
        'notifier_cancelled',
        'notifier_cleared'
    ],
    deps: {
        title:'text',
        gcmSenderId: 'text'
    },
    create: function(deps){
        var
        self = this,
        ln= __.refChain(window, ['cordova', 'plugins', 'notification', 'local']),
        n= __.refChain(window, ['plugins', 'pushNotification'])

        if (!ln && !n) {
            this.slots = {}
            return console.warn(ERR_NOT_FOUND)
        }

        ln.hasPermission(function(ok){
            if (ok) return setup(self, n, ln)
            ln.registerPermission(function(ok){
                if (ok) return setup(self, n, ln)
            })
        })
    },
    slots: {
        notifier_register: function(from, sender, platform){
            register(this, platform)
        },
        notifier_unregister: function(from, sender){
            unregister(this)
        },
        // desc of options see https://github.com/katzer/cordova-plugin-local-notifications/wiki/04.-Scheduling
        notifier_schedule: function(from, sender, notis){
            if (!notis || !notis.length) return console.error(ERR_PARAMS)
            scheduler(this, this.localNotifier, notis, sender)
        },
        notifier_update: function(from, sender, id, changes){
            if (!id) return console.error(ERR_PARAMS)
            chnages.id = id
            this.localNotifier.update(changes, function(){ this.signals.notifier_updated(id).send(sender) }, this)
        },
        notifier_clear: function(from, sender, ids){
            if (undefined === ids || null === ids) return console.error(ERR_PARAMS)
            var ln = this.localNotifier
            if (0 === ids) return ln.clearAll(function(){ this.signals.notifier_cleared(ids).send(sender) }, this)
            ln.clear(ids, function(){ this.signals.notifier_cleared(ids).send(sender) }, this)
        },
        notifier_cancel: function(from, sender, ids){
            if (undefined === ids || null === ids) return console.error(ERR_PARAMS)
            var ln = this.localNotifier
            if (0 === ids) return ln.cancelAll(function(){ this.signals.notifier_cancelled(ids).send(sender) }, this)
            ln.cancel(ids, function(){ this.signals.notifier_cancelled(ids).send(sender) }, this)
        },
        notifier_triggered: function(from, sender){
            this.localNotifier.getTriggered(function(notis){
                this.signals.notifier_triggered(notis).send(sender)
            }, this)
        }
    }
}
