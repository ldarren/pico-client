return{
    className: 'lock',
    deps:{
		tpl:['file','<a href=#>Unlock</a>']
    },
    create: function(deps){
        this.el.innerHTML=deps.tpl()
    }
}
