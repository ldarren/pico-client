
return {
	signals:['click'],
	deps:{
		tpl:'file',
		data:'map',
		text:'text'
	},
	create:function(deps,params){
		this.super.create.call(this, deps, params)
		this.el.innerHTML= deps.tpl(deps.data)
	},
	rendered:function(){
		var btn=this.el.querySelector('button')
		var self = this
		btn.addEventListener('click',function caller(e){
			btn.removeEventListener('click',caller)
			self.signals.click(e.target.textContent).send(self.host)
		})
	},
	events1:{
		'click button':function(e,target){
			this.signals.click(target.textContent).send(this.host)
		}
	}
}
