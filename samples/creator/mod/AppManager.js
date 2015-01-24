exports.Class = {
    signals: ['appRegister', 'appFocus', 'appInstance'],
    deps: {
        'id': 'text',
        'icon': 'text',
        'name': 'text',
        'owner': 'model',
    },
    tagName: 'form',
    create: function(deps){
        this.signals.appRegister(this, deps.id, deps.icon, deps.name).send(this.host)
    },
    render: function(){},
    slots: {
        createInstance: function(sender){
            var deps = this.deps

            this.signals.appInstance(this.el, {
                id: deps.id,
                icon: deps.icon,
                name: deps.name,
                width: 500,
                height: 400
            }).send(sender)
        },
        destroyInstance: function(sender, instId){
        },
    }
}
