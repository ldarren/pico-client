var tpl= require('Void.asp')

return{
    deps:{
        info:'map'
    },
    className: 'voidPage',
    create: function(deps){
        this.el.innerHTML=tpl(info)
    }
}
