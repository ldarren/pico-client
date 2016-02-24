return{
	tagName:'ul',
    classname: 'tabs',
    deps:{
		list:list
    },
    create: function(deps){
		var
		el=this.el,
		ele
		for(var i=0,list=deps.list,li; li=list[i]; i++){
			ele=document.create('li')
			ele.textContent=li
			el.appendChild(ele)
		}
    },
    events: {
	},
    slots: {
    }
}
