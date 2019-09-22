return {
	deps:{
		tpl:'file',
		model:'model'
	},
	create:function(deps){
		this.el.innerHTML=deps.tpl(deps.model)
		//deps.model.desc=deps.model.desc+Date.now()
	}
}
