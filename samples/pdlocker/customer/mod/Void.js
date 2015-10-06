var tpl= require('Void.html')

return{
    deps:{
        info:'map'
    },
    className: 'voidPage',
    create: function(deps){
        this.el.innerHTML=tpl(info)
    }
}
