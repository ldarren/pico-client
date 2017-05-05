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
		'click button':function(e){
			this.sigslots.click(e.target.textContent).send(this.host)
		}
	}
}
