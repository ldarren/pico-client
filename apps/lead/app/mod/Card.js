var
change=function(model){
    var self=this
    this.parseData(model.attributes, function(err, d){
        if (err) return console.error(err)
        self.el.innerHTML=self.deps.tpl(d)
    })
}

return{
	tagName:'li',
	signals:['scrollTo','scan','unlock'],
	deps:{
		data:'model',
		tpl:'file'
	},
	create: function(deps){
        change.call(this, deps.data)
        this.listenTo(data,'change',change)
        this.listenTo(data,'destroy',this.remove)
	},
    parseData:function(data,cb){
        cb(null,data)
    }
}
