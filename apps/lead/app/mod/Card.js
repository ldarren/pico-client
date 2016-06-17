var
change=function(model){
    this.el.innerHTML=this.deps.tpl(this.parseData(model.attributes))
}

return{
	tagName:'li',
	signals:['scrollTo','scan','unlock'],
	deps:{
		data:'model',
		tpl:'file'
	},
	create: function(deps){
        var data=deps.data
		this.el.innerHTML = deps.tpl(this.parseData(data.attributes))
        this.listenTo(data,'change',change)
        this.listenTo(data,'destroy',this.remove)
	},
    parseData:function(data){
        return data
    }
}
