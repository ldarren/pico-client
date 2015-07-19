exports.Class = {
    signals: ['appRegister', 'appDeregister', 'appFocus', 'appInstance'],
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
        this.signals.appRegister(deps.id, deps.icon, deps.name).send(this.host)
    },
    remove: function(){
        this.signals.appDeregister(this.deps.id).send(this.host)
        this.ancestor.remove.call(this)
    },
    render: function(){},
    slots: {
        createInstance: function(from, sender){
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
        destroyInstance: function(from, sender, instId){
            this.dump(this.contentMod)
            this.instances.length = 0
        },
        signup: function(from, sender){
            this.changeMod('mod/Signup')
        },
        signout: function(from, sender){
            this.changeMod('mod/Signin')
        },
        userReady: function(from, sender){
            this.changeMod('mod/Signin')
        }
    },
    changeMod: function(mod){
        var
        deps = this.deps,
        insts = this.instances

        if (!insts) return

        this.dump(this.contentMod)
        insts.length = 0

        this.contentMod = this.spawn(deps.owner.length ? deps['mod/UserInfo'] : deps[mod])

        insts.push(deps.id)
    }
}
