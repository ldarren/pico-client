var Router = require('js/Router')

return {
    tagName:'form',
    className: 'form',
    deps:{
		tpl:'file'
    },
    create: function(deps){
    },
    slots:{
		formShow:function(from,sender,data){
			this.el.innerHTML=this.deps.tpl(data)
		}
    }
}
