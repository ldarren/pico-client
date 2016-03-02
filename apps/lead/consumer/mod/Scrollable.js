return{
	className:'scrollable',
	deps:{
		html:['file','<div><ul></ul></div>'],
		list:'list',
		cell:'view'
	},
	create: function(deps){
		this.el.innerHTML=deps.html
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
	},
	events:{
	}
}
