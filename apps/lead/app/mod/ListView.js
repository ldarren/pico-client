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
loadDependencies=function(model,coll){
    var self=this
    this.loadDependencies(coll,function(){
        addRow.call(self,model)
    })
},
addRow=function(model){
	if (this.filter(model.attributes)) this.spawn(this.deps.Cell, [model.id], [['data','model','list',0]])
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
    tagName:'ul',
	className:'scrollable',
	deps:{
		emptyMsg:['file','There are no items at this time'],
		list:'models',
		Cell:'view'
	},
	create: function(deps){
        var list=deps.list
		this.listenTo(list,'add',loadDependencies)
		this.listenTo(list,'reset',this.rendered)
	},
	remove:function(){
		scrolls.filter(removeExisting,this.el)
		this.ancestor.remove.call(this)
	},
	rendered:function(){
        this.dumpAll()

		var
        self=this,
		deps=this.deps,
		list=deps.list

        var li=document.createElement('li')
        li.classList.add('empty-message')
        li.innerHTML=deps.emptyMsg
        this.el.appendChild(li)

		this.loadDependencies(list,function(){
            list.each(addRow,self)
        })
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
    loadDependencies:function(list, cb){
        cb()
    },
	filter:function(model){
		return true
	}
}
