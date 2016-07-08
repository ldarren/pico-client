return {
	className:'keypad',
	deps:{
		html:'file',
		keypadCtrl:'ctrl'
	},
	create:function(deps){
		this.el.innerHTML=deps.html
	},
	events:{
		'touchstart .btn':function(e){
			e.target.closest('.btn').classList.add('down')
		},
		'touchend .btn':function(e){
			e.target.closest('.btn').classList.remove('down')
		}
	}
}
