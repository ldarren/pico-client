exports.Class = {
    signals: ['appRegister', 'appFocus', 'appInstance'],
    deps: {
        'id': 'text',
        'icon': 'text',
        'name': 'text',
        'owner': 'model'
    },
    tagName: 'h1',
    create: function(deps){
        this.el.textContent = 'User Settings'
        this.instances = []
        /*
        CodeMirror(this.$content[0], {
              value: "function myScript(){return 100;}\n",
              mode:  "javascript"
        })
        */
    },
    render: function(){},
    slots: {
        desktopReady: function(sender){
            var deps = this.deps
            this.signals.appRegister(deps.id, deps.icon, deps.name).send(this.host)
        },
        createInstance: function(sender){
            var insts = this.instances

            if (insts.length){
                this.signals.appFocus(insts[0]).send(sender)
            }else{
                var deps = this.deps
                this.signals.appInstance(deps.id, deps.icon, deps.name, this.el).send(sender)
                insts.push(deps.id)
            }
        },
        destroyInstance: function(sender, instId){
            this.instances.length = 0
        }
    }
}
