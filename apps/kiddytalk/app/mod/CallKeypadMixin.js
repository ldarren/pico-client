var Router=require('js/Router')

return {
	signals:['callAccepted','header'],
	create:function(deps){
		this.el.innerHTML=deps.html
		this.signals.header().send(this.host)
	},
	events:{
		'touchend .btn':function(e){
			var btn=this.selectBtn(e.target)
			if (!btn) return
			var cl=btn.classList
			cl.remove('down')

			if (cl.contains('call')){
				cl.add('hidden')
				this.signals.callAccepted().send()
			}else{
				Router.go('keypad')
			}
		}
	}
}
