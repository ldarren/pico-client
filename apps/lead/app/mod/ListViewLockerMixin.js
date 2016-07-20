return {
	signals:['headerButtonClicked'],
	events:{
		'click button.addLocker':function(e){
			this.signals.headerButtonClicked('plus').send(this.host)
		}
	},
	postRender:function(){
		var btn=document.createElement('button')
		btn.classList.add('addLocker')
		btn.textContent='Add Locker'
		this.el.insertBefore(btn, this.el.firstChild);
	}
}
