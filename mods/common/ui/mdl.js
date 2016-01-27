return {
    signals:['paneAdded'],
    deps:{
        el:'text'
    },
    create:function(deps){
        this.setElement(deps.el)
    },
    slots:{
        flyerAdded: function(){
            componentHandler.upgradeDom()
        },
        paneAdd: function(from, sender, pane, isBack){
            this.el.appendChild(pane)
            componentHandler.upgradeDom()
            this.signals.paneAdded().send(this.host) 
        },
        moduleAdded: function(from, sender, mod){
            if (!mod.el) return
            componentHandler.upgradeDom()
        },
        paneTransit: function(from, sender, options){
        }
    }
}
