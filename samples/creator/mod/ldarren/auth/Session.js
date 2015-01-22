var
Router = require('Router'),
network = require('network'),
storage = window.localStorage,
cache = function(model, coll){
    var cred = model.attributes
    network.signalStep('addon', [cred]) 
    storage.setItem('owner', JSON.stringify(cred))
    this.signals.signin(model).send()

    userReady.call(this, model)
},
uncache = function(){
    this.signals.signout().send()
    storage.removeItem('owner')
    network.signalStep('addon', []) 

    // signout
    this.stopListening(this.data, 'add')
    this.listenTo(this.data, 'add', userAdded)
    if (-1 === this.authPages.indexOf(Router.instance.currPath())) Router.instance.go(this.authPages[0])
},
userReady = function(model){
    var user = this.data.get(model.id)
    if (!user) return
    this.stopListening(this.data, 'add')
    this.signals.userReady(user).send()
    if (-1 !== this.authPages.indexOf(Router.instance.currPath())) Router.instance.home(true)
    this.signals.modelReady().send()
},
userAdded = function(model){
    if (model.id !== this.owner.models[0].id) return
    this.stopListening(this.data)
    if (this.owner.length) userReady.call(this, this.owner.models[0])
}

exports.Class = {
    signals: ['signin', 'signout', 'modelReady', 'userReady'],
    deps: {
        owner:'ref',
        data: 'ref',
        authPages: 'list'
    },
    create: function(deps){
        var
        owner = deps.owner,
        cached = storage.getItem('owner')

        this.data = deps.data
        this.authPages = deps.authPages

        owner.reset()
        this.owner = owner
        this.listenTo(owner, 'add', cache)
        this.listenTo(owner, 'reset', uncache)
        this.listenTo(this.data, 'add', userAdded)
        network.slot('error', this.onNetworkError, this)

        if(cached){
            try{ owner.add(JSON.parse(cached)) }
            catch(exp){ console.error(exp) }
        }else{
            this.signals.modelReady().send()
        }
    },
    onNetworkError: function(err){
        if (403 !== err.code){
            if (err.code) alert('Server error ['+err.code+'] msg['+err.msg+']')
            return
        }
        this.owner.reset()
        uncache.call(this)
    },
    slots: {
        changeRoute: function(sender){
            if (!this.authPages.length) return
            if (!this.owner.length && -1 === this.authPages.indexOf(arguments[2])) Router.instance.go(this.authPages[0])
        }
    }
}
