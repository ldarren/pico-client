
return {
	signals:['click'],
	deps:{
		tpl:'file',
		data:'map'
	},
	create:function(deps,params){
		this.el.innerHTML=deps.tpl(deps.data)
		var self=this
		var btn=this.el.querySelector('button')
		var click=function(e){
			btn.removeEventListener('click',click,false)
			self.signals.click(e.target.textContent).send()
		}
		btn.addEventListener('click',click,false)
	},
	events2:{
		'click button':function(e){
			this.signals.click(e.target.textContent).send(this.host)
		}
	}
}
