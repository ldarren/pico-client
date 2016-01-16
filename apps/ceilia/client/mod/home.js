var
Router=require('js/Router'),
tpl=require('home.asp')

return {
    create:function(){
        this.el.innerHTML=tpl()
    },
    slots:{
        headerAction:function(from, sender, icon){
            Router.go('signin')
        }
    }
}
