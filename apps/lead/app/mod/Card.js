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
        var
        self=this,
        data=deps.data

        this.parseData(data.attributes, function(err, d){
            if (err) return console.error(err)
            self.el.innerHTML = deps.tpl(d)
            self.listenTo(data,'change',change)
            self.listenTo(data,'destroy',self.remove)
        })
	},
    parseData:function(data,cb){
        cb(null,data)
    }
}
