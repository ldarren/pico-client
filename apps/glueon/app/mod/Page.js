return{
    signals:['pageAdded'],
    deps:{
        paneId:'int'
    },
    slots:{
        frameAdded: function(){},
        pageAdd: function(from, sender, paneId, page, isBack){
            if (this.deps.paneId !== paneId) return
            this.signals.pageAdded(paneId).sendNow(this.host)
        },
        moduleAdded: function(from, sender, paneId){
            if (this.deps.paneId !== paneId) return
            document.dispatchEvent(__.createEvent('__reset'))
        },
        pageTransit: function(from, sender, paneId, options){
            if (this.deps.paneId !== paneId) return
            this.el.dispatchEvent(__.createEvent('__transit', options))
        }
    }
}
