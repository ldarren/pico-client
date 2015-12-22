var tpl=require('header.asp')

return {
    signals:['invalidate'],
    create:function(deps){
        this.el.innerHTML=tpl()
        this.signals.invalidate('frame',true).send(this.host)
    }
}
