return {
	signals:['headerButtonClicked'],
	events:{
		'click .addLocker':function(e){
			this.signals.headerButtonClicked('plus').send(this.host)
		}
	},
	postRender:function(){
		var div=document.createElement('div')
		div.classList.add('addLocker')
		div.classList.add('button')
		div.classList.add('card')
		div.textContent='Add Locker'
		this.el.insertBefore(div, this.el.firstChild);
	}
}
