return {
	signals:['headerButtonClicked'],
	events:{
		'click button.addRequest':function(e){
			this.signals.headerButtonClicked('plus').send(this.host)
		}
	},
	postRender:function(){
		var btn=document.createElement('button')
		btn.classList.add('addRequest')
		btn.textContent='Add Request'
		this.el.insertBefore(btn, this.el.firstChild);
	}
}
