return {
    signals:['invalidate'],
    deps:{
        html:'file',
        container:'text',
        first:'bool'
    },
    create:function(deps){
        this.el.innerHTML=deps.html
        this.signals.invalidate(deps.container,deps.first).send(this.host)
    }
}
