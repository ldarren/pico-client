var
Router = require('js/Router'),
network = require('js/network'),
storage = window.localStorage,
changed=function(model){
    var cred = model.attributes
    network.addon([cred]) 
    storage.setItem('owner', JSON.stringify(cred))
},
cache = function(model, coll){
    changed.call(this, model)

    var
    users = this.deps.users,
    user = users.get(model.id)

    this.signals.signin(model).dispatch()
	this.userReadied = false

    if (user) userReady.call(this, user)
    else this.listenTo(users, 'add', userAdded)
},
uncache = function(){
    this.signals.signout().send()
    storage.removeItem('owner')
    network.addon([]) 

    var
    u = this.deps.users,
    ap = this.deps.authPages

    // signout
    this.stopListening(u, 'add', userAdded)
    this.listenTo(u, 'add', userAdded)
    if (-1 === ap.indexOf(Router.currPath())) Router.go(ap[0])
},      
userAdded = function(model){
    var o = this.deps.owner
    if (!o.length || model.id !== o.at(0).id) return
    this.stopListening(this.deps.users, 'add', userAdded)
    userReady.call(this, model)
},
userReady = function(user){
    if (!user) return

    if (!this.userReadied || this.deps.owner.at(0).hasChanged(['id']))this.signals.userReady(user).dispatch()
	this.userReadied= true
    if (-1 !== this.deps.authPages.indexOf(Router.currPath())) Router.home(true)
    if (!this.modelReadied)this.signals.modelReady().send()
    this.modelReadied= true
},
onNetworkError= function(err){
    if (403 !== err.code){
        if (err.code) alert('Server error ['+err.code+'] msg['+err.msg+']')
        return
    }
    this.signals.modelReady().dispatch() // router may not initialized
    this.deps.owner.reset()
}

return{
    signals: ['signin', 'signout', 'modelReady', 'userReady'],
    deps: {
        owner:'ref',
        users: 'ref',
        authPages: 'list'
    },
    create: function(deps){
        var
        owner = deps.owner,
        cached = storage.getItem('owner')

        owner.reset()
        this.listenTo(owner, 'add', cache)
        this.listenTo(owner, 'reset', uncache)
        this.listenTo(owner, 'change', changed)

        this.listenTo(Backbone, 'networkErr', onNetworkError)

        if(cached){
            try{ owner.add(JSON.parse(cached)) }
            catch(exp){ console.error(exp) }
        }else{
            this.modelReadied = true
            this.signals.modelReady().send()
        }
    },
    slots: {
        changeRoute: function(from, sender, route){
            var ap = this.deps.authPages
            if (!ap.length) return
            if (!this.deps.owner.length && -1 === ap.indexOf(route)) Router.go(ap[0])
        }
    }
}
