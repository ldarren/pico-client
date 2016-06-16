return{
	className:'scrollable',
	deps:{
		html:['file','<ul><li class=empty-message>There are no items at this time.</li></ul>']
	},
	create: function(deps){
		this.el.innerHTML=deps.html
	},
    rendered:function(){
        this.setElement(this.el.querySelector('ul'))

        this.spawnAsync(this.spec)
    }
}
