var
Router=require('js/Router'),
picoStr=require('pico/str'),
tpl=require('signup.asp')

return {
    deps:{
        owner:'models'
    },
    create:function(){
        this.el.innerHTML=tpl()
    },
    events:{
        'click button#signup':function(e){
            var form=this.el.querySelector('form')

            if (!form.checkValidity()) return __.dialogs.alert('Invalid input')

            var
            owner= this.deps.owner,
            els=form.elements,
            userpass=els.userpass.value

            if (userpass !== els.confirm.value) return __.dialogs.alert('password not the same')

            owner.reset()
            owner.create(null, {
                data: {
                    un: els.username.value.trim(),
                    pwd: picoStr.hash(userpass),
                    json: JSON.stringify({name:els.name.value, email:els.email.value})
                },
                wait:true,
                success:function(coll, raw){
                    owner.add(raw)
                }
            })
        },
        'click a#cancel':function(e){
            e.preventDefault()
            Router.back()
        }
    }
}
