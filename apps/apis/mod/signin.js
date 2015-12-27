var
picoStr=require('pico/str'),
tpl=require('signin.asp')

return {
    deps:{
        owner:'models'
    },
    create:function(){
        this.el.innerHTML=tpl()
    },
    events:{
        'click .mdl-button':function(e){
            var form=this.el.querySelector('form')

            if (!form.checkValidity()) return __.dialogs.alert('Invalid input')

            var
            owner= this.deps.owner,
            els=form.elements

            owner.reset()
            owner.create(null, {
                data: {
                    un: els.username.value.trim(),
                    passwd: picoStr.hash(els.userpass.value)
                },
                success:function(coll, raw){
                    owner.add(raw)
                }
            })
        }
    }
}
