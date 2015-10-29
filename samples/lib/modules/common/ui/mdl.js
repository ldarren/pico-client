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
            el.appendChild(page)
            componentHandler.upgradeElement(page.el)
            self.signals.pageAdded().send(self.host) 
        },
        moduleAdd: function(from, sender, mod){
            if (document.querySelector('.mdl-layout__header') && document.querySelector('.mdl-layout__drawer')) componentHandler.upgradeDom()
        }
    }
}
