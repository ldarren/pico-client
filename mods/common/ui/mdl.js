return {
    signals:['pageAdded'],
    deps:{
        el:'text'
    },
    create:function(deps){
        this.setElement(deps.el)
    },
    slots:{
        frameAdded: function(){
            componentHandler.upgradeDom()
        },
        pageAdd: function(from, sender, page, isBack){
            this.el.appendChild(page)
            componentHandler.upgradeDom()
            this.signals.pageAdded().send(this.host) 
        },
        moduleAdded: function(from, sender, mod){
            if (!mod.el) return
            componentHandler.upgradeDom()
        },
        pageSlide: function(from, sender, options){
        }
    }
}
