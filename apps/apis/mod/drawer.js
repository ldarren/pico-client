var tpl=require('drawer.asp')

return {
    signals:['invalidate'],
    create:function(){
        this.el.innerHTML=tpl()
        this.signals.invalidate('frame').send(this.host)
    }
}
