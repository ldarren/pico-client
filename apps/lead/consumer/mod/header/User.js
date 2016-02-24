return{
    className: 'user',
    deps:{
		tpl:'file'
    },
    create: function(deps){
        this.el.innerHTML=deps.tpl({path:'dat/p4.png',badge:5})
    },
    events: {
    },
    slots: {
    }
}
