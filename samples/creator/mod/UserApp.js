exports.Class = {
    signals: ['appRegister', 'appFocus', 'appInstance'],
    deps: {
        'id': 'text',
        'icon': 'text',
        'name': 'text',
        'owner': 'model',
        'mod/Signin': 'module',
        'mod/Signup': 'module',
        'mod/UserInfo': 'module'
    },
    create: function(deps){
        this.instances = []
        if(this.desktopReadied)this.signals.appRegister(deps.id, deps.icon, deps.name).send(this.host)

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
            this.desktopReadied = true
            if (!this.instances) return
            this.desktopReadied = false
            var deps = this.deps
            this.signals.appRegister(deps.id, deps.icon, deps.name).send(this.host)
        },
        createInstance: function(sender){
            var insts = this.instances

            if (insts.length){
                this.signals.appFocus(insts[0]).send(sender)
            }else{
                var deps = this.deps

                this.contentMod = this.spawn(deps.owner.length ? deps['mod/UserInfo'] : deps['mod/Signin'])

                this.signals.appInstance(this.el, {
                    id: deps.id,
                    icon: deps.icon,
                    name: deps.name,
                    width: 500,
                    height: 400
                }).send(sender)
                insts.push(deps.id)
            }
        },
        destroyInstance: function(sender, instId){
            this.dump(this.contentMod)
            this.instances.length = 0
        }
    }
}
