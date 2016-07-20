return {
	signals:['headerButtonClicked'],
	deps:{
		buttonText:['text','Add']
	},
	events:{
		'click .card.button':function(e){
			this.signals.headerButtonClicked('plus').send(this.host)
		}
	},
	postRender:function(){
		var div=document.createElement('div')
		div.classList.add('button')
		div.classList.add('card')
		div.textContent=this.deps.buttonText
		this.el.insertBefore(div, this.el.firstChild);
	}
}
