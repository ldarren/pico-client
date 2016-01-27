return {
    signals:['pageAdded'],
    deps:{
        el:'text'
    },
    create:function(deps){
        this.setElement(deps.el)
        console.log('no ui created')
    },
    slots:{
        flyerAdded: function(){},
        pageAdd: function(from, sender, page, isBack){
            this.el.appendChild(page)
            this.signals.pageAdded().send(this.host)
        },
        moduleAdded: function(from, sender){},
        pageTransit: function(from, sender, options){}
    }
}
