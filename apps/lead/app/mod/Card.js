return{
	tagName:'li',
	signals:['scrollTo','scan','unlock'],
	deps:{
		data:'map',
		tpl:'file'
	},
	create: function(deps){
		this.el.innerHTML = deps.tpl(this.parseData(this.deps.data))
	},
    parseData:function(data){
        return data
    }
}
