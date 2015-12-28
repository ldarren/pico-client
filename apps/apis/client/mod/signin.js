var
Router=require('js/Router'),
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
        'click button#signin':function(e){
            var form=this.el.querySelector('form')

            if (!form.checkValidity()) return __.dialogs.alert('Invalid input')

            var
            owner= this.deps.owner,
            model=new owner.model,
            els=form.elements

            owner.reset()
            model.fetch({
                data: {
                    un: els.username.value.trim(),
                    passwd: picoStr.hash(els.userpass.value)
                },
                success:function(model, raw){
                    owner.add(model)
                }
            })
        },
        'click a#signup':function(e){
            e.preventDefault()
            Router.go('signup')
        }
    }
}
