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
            componentHandler.upgradeElement(page)
            self.signals.pageAdded().send(self.host) 
        },
        moduleAdd: function(from, sender, mod){
            if (!mod) return componentHandler.upgradeDom()
            componentHandler.upgradeElement(mod)
        }
    }
}
