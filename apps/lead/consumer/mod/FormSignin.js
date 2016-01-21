var
picoStr=require('pico/str'),
Router = require('js/Router'),
tpl = require('FormSignin.asp')

return {
    tagName:'form',
    className: 'login',
    signals:['noHeader'],
    deps:{
        owner:'models',
        auth:'models',
        title:'text'
    },
    create: function(deps){

        this.el.innerHTML=tpl({title:deps.title})

        if(deps.owner.length){
            Router.home(true);
        }
        this.signals.noHeader().send(this.host)
    },

    events: {
        'click .login__submit':function(e){
            var
            self = this,
            fe = self.el,
            ee = fe.querySelector('.inline-error'),
            be = fe.querySelector('button'),
            becl=be.classList
            
            ee.textContent = ''
            
            if (!fe.checkValidity()) {
                ee.textContent = 'Your username and password must not be blank'
                return
            }

            if (becl.contains('processing')) return
            becl.add('processing')
            be.textContent = 'Processing...'

            // HACK! on ios if the virtual keyboard doesnt close at this stage, form will not render for unknown reason
            if (typeof device !== 'undefined' && typeof cordova.plugins.Keyboard !== 'undefined' && device.platform.toUpperCase() === 'IOS') {
                cordova.plugins.Keyboard.close()
            }
            
            this.deps.auth.create(null, {
                data: {
                    un: fe.username.value.trim(),
                    pwd: picoStr.hash(fe.userpass.value)
                },
                wait: true,
                error: function(e){
                    ee.textContent = 'Access denied'
                    be.removeAttribute('processing')
                    be.textContent = 'Sign In'
                },
                success: function(user, raw){
                    self.deps.owner.add(raw)
                    be.textContent = 'Success'
                    becl.add('success')
                }
            })
        }
    }
}
