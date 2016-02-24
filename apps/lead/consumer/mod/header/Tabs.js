return{
	tagName:'ul',
    className: 'tabs',
    deps:{
		list:'list',
		selected:['int',0]
    },
    create: function(deps){
		var
		el=this.el,
		list=deps.list,
		selected=deps.selected,
		width=100/list.length,
		ele
		for(var i=0,list=deps.list,li; li=list[i]; i++){
			ele=document.createElement('li')
			ele.textContent=li
			ele.style='width:'+width+'%'
			if (selected===i) ele.classList.add('selected')
			el.appendChild(ele)
		}
    },
    events: {
		'click li':function(e){
			var lis=this.el.querySelectorAll('li')
			for(var i=0,li; li=lis[i]; i++){
				li.classList.remove('selected')
			}
			e.target.classList.add('selected')
		}
	},
    slots: {
    }
}
