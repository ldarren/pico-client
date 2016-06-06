return{
	className:'scrollable',
	deps:{
		html:['file','<div><ul><li class=empty-message>There are no items at this time.</li></ul></div>'],
		containerSelector:['text','div']
	},
	create: function(deps){
		this.el.innerHTML=deps.html
		this.setElement(this.el.querySelector('ul'))

        this.spawnAsync(this.spec)
	}
}
