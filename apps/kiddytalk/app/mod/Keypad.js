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
			this.selectBtn(e.target).classList.add('down')
		},
		'touchend .btn':function(e){
			this.selectBtn(e.target).classList.remove('down')
		}
	},
	selectBtn:function(target){
		var btn=target
		while(btn && !btn.classList.contains('btn')){
			btn=btn.parentElement
		}
		return btn
	}
}
