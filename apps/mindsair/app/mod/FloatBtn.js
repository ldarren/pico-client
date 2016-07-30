return {
	tagName:'a',
	className:'float',
	signals:['layerShow','showChat'],
	deps:{
		tpl:'file',
		icon:'text'
	},
	create:function(deps){
		this.el.innerHTML=deps.tpl({icon:deps.icon})
		this.signals.layerShow(1).send(this.host)
	},
	events:{
		'click':function(e){
			e.preventDefault()
			this.el.classList.add('hidden')
			this.signals.showChat().send(this.host)
		}
	},
	slots:{
		hideChat:function(from, sender){
			this.el.classList.remove('hidden')
		}
	}
}
