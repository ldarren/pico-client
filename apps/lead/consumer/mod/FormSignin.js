var
picoStr=require('pico/str'),
Router = require('js/Router'),
tpl = require('FormSignin.asp')

return {
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
  $(document).on("click", ".login__submit", function(e) {
    if (animating) return;
    animating = true;
    var that = this;
    ripple($(that), e);
    $(that).addClass("processing");
    setTimeout(function() {
      $(that).addClass("success");
      setTimeout(function() {
        $app.show();
        $app.css("top");
        $app.addClass("active");
      }, submitPhase2 - 70);
      setTimeout(function() {
        $login.hide();
        $login.addClass("inactive");
        animating = false;
        $(that).removeClass("success processing");
      }, submitPhase2);
    }, submitPhase1);
  });
        'click .login__submit':function(e){
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
            // HACK! on ios if the virtual keyboard doesnt close at this stage, form will not render for unknown reason
            if (typeof device !== 'undefined' && typeof cordova.plugins.Keyboard !== 'undefined' && device.platform.toUpperCase() === 'IOS') {
                cordova.plugins.Keyboard.close()
            }
            be.textContent = 'Authenticating...'
            be.setAttribute('disabled','')
            
            this.deps.auth.create(null, {
                data: {
                    un: fe.username.value.trim(),
                    pwd: picoStr.hash(fe.password.value)
                },
                wait: true,
                error: function(e){
                    ee.textContent = 'Access denied'
                    be.removeAttribute('disabled')
                    be.textContent = 'Login'
                },
                success: function(user, raw){
                    self.deps.owner.add(raw)
                    be.textContent = 'Loading...'
                }
            })
        }
    }
}
