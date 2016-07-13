return {
	className:'keypad',
	signals:['WebAudio_start'],
	deps:{
		html:'file',
		keypadCtrl:'ctrl'
	},
	create:function(deps){
		this.el.innerHTML=deps.html
	},
	events:{
		'touchstart .btn':function(e){
			this.signals.WebAudio_start('dial').send(this.host)
			e.target.closest('.btn').classList.add('down')
		},
		'touchend .btn':function(e){
			e.target.closest('.btn').classList.remove('down')
		}
	}
}
