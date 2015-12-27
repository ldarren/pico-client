var tpl=require('drawer.asp')

return {
    signals:['invalidate'],
    create:function(){
        this.el.innerHTML=tpl()
        this.signals.invalidate('frame').send(this.host)
    },
    slots:{
        hideDrawer:function(from, sender){
            this.el.classList.toggle('is-visible')
            //$(".mdl-layout__drawer").toggleClass("is-visible")
        }
    }
}
