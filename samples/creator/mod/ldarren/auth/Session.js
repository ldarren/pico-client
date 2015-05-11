var
Router = require('Router'),
network = require('network'),
storage = window.localStorage,
cache = function(model, coll){
    var cred = model.attributes
    network.signalStep('addon', [cred]) 
    storage.setItem('owner', JSON.stringify(cred))
console.log('cache send signin')
    this.signals.signin(model).send()

    userReady.call(this, model)
},
uncache = function(){
    this.signals.signout().send()
    storage.removeItem('owner')
    network.signalStep('addon', []) 

    var
    d = this.deps.data,
    ap = this.deps.authPages

    // signout
    this.stopListening(d, 'add')
    this.listenTo(d, 'add', userAdded)
    if (-1 === ap.indexOf(Router.instance.currPath())) Router.instance.go(ap[0])
},
userReady = function(model){
    var
    d = this.deps.data,
    ap = this.deps.authPages,
    user = d.get(model.id)
console.log('userReady: '+(user ? user.toJSON() : 'undefined'))
    if (!user) return
    this.stopListening(d, 'add')
    this.signals.userReady(user).send()
    if (-1 !== ap.indexOf(Router.instance.currPath())) Router.instance.home(true)
    this.signals.modelReady().send()
},
userAdded = function(model){
    var o = this.deps.owner
    if (model.id !== o.models[0].id) return
    this.stopListening(this.deps.data)
    if (o.length) userReady.call(this, o.models[0])
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

        owner.reset()
        this.listenTo(owner, 'add', cache)
        this.listenTo(owner, 'reset', uncache)
        this.listenTo(deps.data, 'add', userAdded)

        network.slot('error', this.onNetworkError, this)
console.log(cached)
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
        this.deps.owner.reset()
        uncache.call(this)
    },
    slots: {
        changeRoute: function(from, sender){
            var ap = this.deps.authPages
            if (!ap.length) return
            if (!this.deps.owner.length && -1 === ap.indexOf(arguments[2])) Router.instance.go(ap[0])
        }
    }
}
