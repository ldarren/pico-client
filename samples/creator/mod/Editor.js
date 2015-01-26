exports.Class = {
    signals: ['appRegister', 'appFocus', 'appInstance'],
    deps: {
        'id': 'text',
        'icon': 'text',
        'name': 'text',
        'owner': 'model',
    },
    create: function(deps){
        this.signals.appRegister(deps.id, deps.icon, deps.name).send(this.host)

        CodeMirror(this.el, {
              value: "function myScript(){return 100;}\n",
              mode:  "javascript"
        })
    },
    render: function(){},
    slots: {
        createInstance: function(from, sender){
            var deps = this.deps

            this.signals.appInstance(this.el, {
                id: deps.id,
                icon: deps.icon,
                name: deps.name,
                width: 500,
                height: 400
            }).send(sender)
        },
        destroyInstance: function(from, sender, instId){
        },
    }
}
