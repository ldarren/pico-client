var Router=require('js/Router')

return {
	signals:['callAccepted','header','WebAudio_stop'],
	create:function(deps){
		this.el.innerHTML=deps.html
		this.signals.header().send(this.host)
	},
	events:{
		'touchend .btn':function(e){
			var btn=e.target.closest('.btn')
			if (!btn) return
			var cl=btn.classList
			cl.remove('down')

			if (cl.contains('call')){
				cl.add('hidden')
				this.signals.callAccepted().send()
			}else{
				Router.back()
				this.signals.WebAudio_start('hangup').send(this.host)
				this.signals.WebAudio_stop().send(this.host)
			}
		}
	}
}
