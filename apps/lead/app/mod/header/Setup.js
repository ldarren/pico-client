return {
    signals:['header'],
    deps:{
        title: 'text',
        left: 'text',
        right: 'text'
    },
    create: function(deps){
        this.signals.header(deps.title, deps.left, deps.right).send(this.host)
    },
    render:function(){}
}
