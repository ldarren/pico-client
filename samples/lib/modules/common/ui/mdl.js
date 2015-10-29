return {
    signals:['pageAdded','pageSlided'],
    deps:{
        el:'text'
    },
    create:function(deps){
        this.setElement(deps.el)
    },
    slots:{
        pageAdd: function(from, sender, page, isBack){
            this.el.appendChild(page)
            componentHandler.upgradeDom()
            this.signals.pageAdded().send(this.host) 
        },
        moduleAdd: function(from, sender, mod){
            if (document.querySelector('.mdl-layout__header') && document.querySelector('.mdl-layout__drawer')) componentHandler.upgradeDom()
        }
    }
}
