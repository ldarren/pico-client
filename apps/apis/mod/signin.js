var 
Router=require('js/Router'),
tpl=require('signin.asp')

return {
    create:function(){
        this.el.innerHTML=tpl()
    },
    events:{
        'click .mdl-button':function(e){
            Router.go('')
        }
    }
}
