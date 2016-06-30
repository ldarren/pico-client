return {
	className:'keypad',
	deps:{
		html:'file',
		keypadCtrl:'ctrl'
	},
	create:function(deps){
		var el=this.el
		el.innerHTML=deps.html
		this.setup()
	},
	events:{
		'touchstart .btn':this.btnDown,
		'touchend .btn':this.btnUp
	},
	setup:function(){
	},
	btnDown:function(e){
		e.currentTarget.classList.add('down')
	},
	btnUp:function(e){
		e.currentTarget.classList.remove('down')
	}
}
