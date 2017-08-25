return {
	signals:['click'],
	deps:{
		tpl:'file',
		data:'map'
	},
	create:function(deps,params){
		this.el.innerHTML=deps.tpl(deps.data)
	},
	events:{
		'click button':function(e, target){
			this.signals.click(target.textContent).send(this.host)
		}
	}
}
