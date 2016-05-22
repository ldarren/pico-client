var
NO=0,
SIGNIN=1,
SIGNUP=2,
Ceil=Math.ceil,Random=Math.random,
picoStr=require('pico/str'),
Router = require('js/Router'),
login=function(){
    var
    fe = this.el,
    ee = fe.querySelector('.error'),
    becl = fe.querySelector('button').classList
    
    ee.textContent = ''
    
    if (!fe.checkValidity()) return ee.textContent = 'Your username and password must not be blank'

    if (becl.contains('processing')) return
    becl.add('processing')

    // HACK! on ios if the virtual keyboard doesnt close at this stage, form will not render for unknown reason
	var n=__.refChain(window,['cordova','plugins','Keyboard'])
	if (n) n.close()

    switch(this.page){
    case SIGNIN:
        this.deps.owner.read({
            un: fe.username.value.trim(),
            pwd: picoStr.hash(fe.userpass.value)
        },function(err){
            if (err){
                ee.textContent = 'Access denied'
                becl.remove('processing')
                return
            }
            becl.add('success')
        })
        break
    case SIGNUP:
        var pass = fe.userpass.value
        if (pass !== fe.userconfirm.value) return ee.textContent = 'Password does not match the confirm password'
        this.deps.owner.create(null, {
            data: {
                un: fe.username.value.trim(),
                pwd: picoStr.hash(pass),
                name:fe.name.value,
				$detail:{img:Ceil(10*Random())}
            },
            wait: true,
            error: function(e){
                ee.textContent = 'Access denied'
                becl.remove('processing')
            },
            success: function(user, raw){
                becl.add('success')
            }
        })
        break
    }
}

return {
    tagName: 'form',
    className: 'modal',
    deps:{
        owner:'models',
		tplSignin:'file',
		tplSignup:'file'
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
            this.el.innerHTML=this.deps.tplSignin()
            this.signals.show(1).send(this.host)
        }
    },

    events: {
        'click a.niko_transit':function(e){
            e.preventDefault()
            switch(this.page){
            case SIGNIN:
                this.page=SIGNUP
                this.el.innerHTML=this.deps.tplSignup()
                break
            default:
                this.page=SIGNIN
                this.el.innerHTML=this.deps.tplSignin()
                break
            }
        },
        'click .submit':login,
        'keypress':function(e){
            if(13===e.keyCode) login.call(this)
        }
    }
}
