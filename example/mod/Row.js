return {
	deps:{
		tpl:'file',
		model:'model'
	},
	create:function(deps){
		// TODO: possible make use of View constuctor to replace innerHTML?
		this.el.innerHTML=deps.tpl(deps.model)
		deps.model.desc=deps.model.desc+Date.now()
	}
}
