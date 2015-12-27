
return {
    signals:['header'],
    deps:{
        title:'text',
        left:'list',
        right:'list'
    },
    create:function(deps){
        this.signals.header(deps.title,deps.right,deps.left).send(this.host)
    }
}
