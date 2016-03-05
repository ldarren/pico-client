var scrollTo=function (el, to, duration) {
console.log(el.scrollTop, to, duration)
	if (duration <= 0) return;
	// TODO: requestAnimationFrame for smoother animation
	setTimeout(function(perTick) {
		el.scrollTop = el.scrollTop + perTick;
		if (el.scrollTop === to) return;
		scrollTo(el, to, duration - 10);
	}, 10, (to - el.scrollTop)/duration * 10);
}

return{
	className:'scrollable',
	deps:{
		html:['file','<div><ul></ul></div>'],
		list:'list',
		cell:'view'
	},
	create: function(deps){
		this.el.innerHTML=deps.html
		this.scrollCont=this.el.querySelector('div')
	},
	rendered:function(){
		var
		deps=this.deps,
		list=deps.list

		this.setElement(this.el.querySelector('ul'))
		for(var i=0,l; l=list[i]; i++){
			this.spawn(deps.cell, null, [['data','map',l]])
		}
	},
	slots:{
		scrollTo:function(from, sender, to, duration){
			scrollTo(this.scrollCont, to, duration)
		}
	},
	events:{
	}
}
