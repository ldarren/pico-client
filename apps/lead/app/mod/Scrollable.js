var
Ceil=Math.ceil,
scrolls=[],
lastUpdate=Date.now(),
scrollTo=function(arr){
	var
	el=arr[0],
	to=arr[1],
	step=arr[2],
	oldFrom=el.scrollTop,
	newFrom=oldFrom+(step*this)

	arr[3]--

	if (!arr[3] || (oldFrom <= to && newFrom >= to)||(oldFrom >= to && newFrom <= to)){
		el.scrollTop=to
		return false
	}
	el.scrollTop=newFrom
	return true
},
removeExisting=function(arr){
	return (arr[0]===this) ? false : true
}

this.update=function(){
	var
	now=Date.now(),
	d=now-lastUpdate

	lastUpdate=now
	if (!scrolls.length) return
	scrolls=scrolls.filter(scrollTo, d)

}

return{
	className:'scrollable',
	deps:{
		html:['file','<div><ul></ul></div>'],
		containerSelector:['text','div'],
		list:'list',
		cell:'view'
	},
	create: function(deps){
		this.el.innerHTML=deps.html
		this.scrollCont=this.el.querySelector(deps.containerSelector)
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
			var el=this.scrollCont
			scrolls=scrolls.filter(removeExisting,el)
			scrolls.push([el, to, (to-el.scrollTop)/duration,Ceil(duration/10)])
		}
	},
	events:{
	}
}
