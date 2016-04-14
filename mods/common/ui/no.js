return{
    signals:['pageAdded'],
    deps:{
        paneId:'int'
    },
    create: function(deps){
    },
    slots:{
        frameAdded: function(){},
        pageAdd: function(from, sender, paneId, page, isBack){
            if (this.deps.paneId !== paneId) return
            this.el.appendChild(page)
            this.signals.pageAdded(paneId).send(this.host)
        },
        moduleAdded: function(from, sender, paneId){},
        pageTransit: function(from, sender, options){}
    }
}
