var
NO=0,
SIGNIN=1,
SIGNUP=2,
picoStr=require('pico/str'),
Router = require('js/Router'),
tplSignin = require('FormSignin.asp'),
tplSignup = require('FormSignup.asp')

return {
    tagName:'form',
    className: 'modal',
    deps:{
        owner:'models'
    },
    signals:['show','hide'],
    create: function(deps){
    },

    slots:{
        signin:function(from, sender, user){
            this.page=NO
            this.signals.hide().send(this.host)
        },
        signout:function(from, sender){
            this.page=SIGNIN
            this.el.innerHTML=tplSignin()
            this.signals.show().send(this.host)
        }
    },

    events: {
        'click a.niko_transit':function(e){
            e.preventDefault()
            switch(this.page){
            case SIGNIN:
                this.page=SIGNUP
                this.el.innerHTML=tplSignup()
                break
            default:
                this.page=SIGNIN
                this.el.innerHTML=tplSignin()
                break
            }
        },
        'click .submit':function(e){
            var
            fe = this.el,
            ee = fe.querySelector('.error'),
            be = fe.querySelector('button'),
            becl=be.classList

            if (becl.contains('processing')) return
            becl.add('processing')
            
            ee.textContent = ''
            
            if (!fe.checkValidity()) return ee.textContent = 'Your username and password must not be blank'

            be.textContent = 'Processing...'

            // HACK! on ios if the virtual keyboard doesnt close at this stage, form will not render for unknown reason
            if (typeof device !== 'undefined' && typeof cordova.plugins.Keyboard !== 'undefined' && device.platform.toUpperCase() === 'IOS') {
                cordova.plugins.Keyboard.close()
            }

            switch(this.page){
            case SIGNIN:
                this.deps.owner.read({
                    un: fe.username.value.trim(),
                    pwd: picoStr.hash(fe.userpass.value)
                },function(err){
                    if (err){
                        ee.textContent = 'Access denied'
                        be.removeAttribute('processing')
                        be.textContent = 'Sign in'
                        return
                    }
                    be.textContent = 'Success'
                    becl.add('success')
                })
                break
            case SIGNUP:
                var pass = fe.userpass.value
                if (pass !== fe.userconfirm.value) return ee.textContent = 'Confirm password and password do not match'
                this.deps.owner.create(null, {
                    data: {
                        un: fe.username.value.trim(),
                        pwd: picoStr.hash(pass),
                        json: {name:fe.name.value.trim()}
                    },
                    wait: true,
                    error: function(e){
                        ee.textContent = 'Access denied'
                        be.removeAttribute('disabled')
                        be.textContent = 'Sign up'
                    },
                    success: function(user, raw){
                        be.textContent = 'Loading...'
                    }
                })
                break
            }
        }
    }
}
