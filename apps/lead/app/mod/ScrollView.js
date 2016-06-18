return{
    tagName:'ul',
	className:'scrollable',
	deps:{
	},
	create: function(deps){
	},
    rendered:function(){
        this.spawnAsync(this.spec)
    }
}
