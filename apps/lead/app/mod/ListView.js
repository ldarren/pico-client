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
},
addRow=function(model){
	var a=model.attributes
	if (this.filter(a)) this.spawn(this.deps.Cell, null, [['data','map',a]])
},
updateRow=function(model){
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
		html:['file','<ul><li class=empty-message>There are no items at this time.</li></ul>'],
		list:'models',
		Cell:'view'
	},
	create: function(deps){
		this.el.innerHTML=deps.html
		this.listenTo(deps.list,'add',addRow)
		this.listenTo(deps.list,'change',updateRow)
	},
	remove:function(){
		scrolls.filter(removeExisting,this.el)
		this.ancestor.remove.call(this)
	},
	rendered:function(){
		var
		deps=this.deps,
		list=deps.list

		this.setElement(this.el.querySelector('ul'))
		list.each(addRow,this)
	},
	slots:{
		scrollTo:function(from, sender, to, duration){
			var el=this.el
			scrolls=scrolls.filter(removeExisting,el)
			scrolls.push([el, to, (to-el.scrollTop)/duration,Ceil(duration/10)])
		}
	},
	events:{
	},
	filter:function(model){
		return true
	}
}
