return{
    tagName:'form',
    className: 'form',
	signals:[],
	deps:{
		tpl:'file',
		rows:'list'
	},
	create: function(deps){
		if (deps.rows) this.el.innerHTML=deps.tpl(deps.rows)
	},
	slots:{
		formShow:function(from,sender,rows){
			this.el.innerHTML=this.deps.tpl(rows)
		}
	},
	events:{
	}
}
