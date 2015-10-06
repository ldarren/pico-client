var
Router = require('js/Router'),
tpl = require('FormSignup.html')

return{
    tagName: 'div',
    className: 'blurctr',
    signals:['noHeader'],
    deps:{
        owner:'models',
        auth:'models'
    },
    create: function(deps){

        this.el.innerHTML=tpl()

        if(deps.owner.length){
            Router.instance.home(true);
        }
        this.signals.noHeader().send(this.host)
    },

    events: {
        'tap button[name=register]': 'register'
    },

    register: function(e){
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
        
        be.textContent = 'Authenticating...'
        be.setAttribute('disabled','')
        
        this.deps.auth.create(null, {
            data: {
                meta: {name:fe.name.value.trim()},
                username: fe.username.value.trim(),
                password: this.hashStr(pass),
                domain: fe.domain.value.toUpperCase()
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
