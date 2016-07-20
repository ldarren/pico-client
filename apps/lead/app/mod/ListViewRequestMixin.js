return {
	signals:['headerButtonClicked'],
	events:{
		'click .addRequest':function(e){
			this.signals.headerButtonClicked('plus').send(this.host)
		}
	},
	postRender:function(){
		var div=document.createElement('div')
		div.classList.add('button')
		div.classList.add('card')
		div.classList.add('addRequest')
		div.textContent='Add Request'
		this.el.insertBefore(div, this.el.firstChild);
	}
}
