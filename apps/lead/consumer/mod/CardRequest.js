return{
	tagName:'li',
	className:'cardRequest',
	deps:{
		tpl:'file',
		data:'map'
	},
	create: function(deps){
		this.el.innerHTML=deps.tpl(deps.data)
	},
	slots:{
	},
	events:{
	}
}
