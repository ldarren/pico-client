var tpl= require('Void.asp')

return{
    tagName: 'p',
    className: 'void',
    deps:{
        info:['map',{message:'Empty'}]
    },
    create: function(deps){
        this.el.innerHTML=tpl(deps.info)
    }
}
