return {
    signals:['invalidate'],
    deps:{
        container:'text',
        log:'text',
        first:'bool'
    },
    create:function(deps, params){
        this.ancestor.create.call(this, deps, params)
        if (deps.container)this.signals.invalidate(deps.container,deps.first).send(this.host)
        if (deps.log) console.log(deps.log)
    }
}
