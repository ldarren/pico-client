var
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
		var json={}
		for(var i=0,e; e=fe[i]; i++){
			switch(e.name){
			case 'username':
			case 'userpass':
			case 'userconfirm':
				break;
			default:
				json[e.name]=e.value.trim()
			}
		}
        this.deps.owner.create(null, {
            data: {
                un: fe.username.value.trim(),
                pwd: picoStr.hash(pass),
                json: json
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
    tagName:'form',
    className: 'form',
    deps:{
        owner:'models',
		tpl:'file',
    },
    create: function(deps){
    },

    slots:{
    },

    events: {
        'keypress':function(e){
            if(13===e.keyCode) login.call(this)
        }
    }
}
