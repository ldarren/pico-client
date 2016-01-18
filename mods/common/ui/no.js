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
        frameAdded: function(){
        },
        pageAdd: function(from, sender, page, isBack){
            this.el.appendChild(page)
            this.signals.pageAdded().send(this.host)
        },
        moduleAdded: function(from, sender){
        },
        pageSlide: function(from, sender, options){
        }
    }
}
