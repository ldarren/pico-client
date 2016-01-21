var
picoStr=require('pico/str'),
Router = require('js/Router'),
tpl = require('FormSignup.asp')

return{
    tagName: 'form',
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
        'tap button[name=register]': function(e){
            var
            self = this,
            fe = this.el.querySelector('form'),
            ee = fe.querySelector('.inline-error'),
            be = fe.querySelector('button')

            if (be.hasAttribute('disabled')) return
            
            ee.textContent = ''
            
            if (!fe.checkValidity()) {
                ee.textContent = 'Your username and password must not be blank'
                return
            }

            var pass = fe.password.value
            if (pass !== fe.confirm.value){
                ee.textContent = 'Confirm password and password do not match'
                return
            }
            // HACK! on ios if the virtual keyboard doesnt close at this stage, form will not render for unknown reason
            if (typeof device !== 'undefined' && typeof cordova.plugins.Keyboard !== 'undefined' && device.platform.toUpperCase() === 'IOS') {
                cordova.plugins.Keyboard.close()
            }
            
            be.textContent = 'Processing...'
            be.setAttribute('disabled','')
            
            this.deps.auth.create(null, {
                data: {
                    un: fe.username.value.trim(),
                    pwd: picoStr.hash(pass),
                    json: {name:fe.name.value.trim()}
                },
                wait: true,
                error: function(e){
                    ee.textContent = 'Access denied'
                    be.removeAttribute('disabled')
                    be.textContent = 'Register'
                },
                success: function(user, raw){
                    self.deps.owner.add(raw)
                    be.textContent = 'Loading...'
                }
            })
        }
    }
}