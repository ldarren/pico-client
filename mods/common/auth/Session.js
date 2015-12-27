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

    this.signals.signin(model).dispatch()
	this.userReadied = false

    var
    users = this.deps.users,
    user=users.get(model.id),
    brief=this.deps.owner.at(0)

    if (user) {
        this.addUser(model.id, users, function(){}) // update in bg
        return userReady.call(this, null, user)
    }
    this.addUser(model.id, users, userReady)
},
uncache = function(){
    this.signals.signout().send()
    storage.removeItem('owner')
    network.addon([]) 

    var
    u = this.deps.users,
    ap = this.deps.authPages

    // signout
    if (-1 === ap.indexOf(Router.currPath())) Router.go(ap[0])
},      
userReady = function(err, user){
    if (err) return console.error(err)
    if (!user) return console.error('owner not found')

    if (!this.userReadied || brief.hasChanged(['id'])) this.signals.userReady(user).dispatch()
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
    },
    addUser: function(userId, users, cb){
        if (!userId) return
        users.add({id:userId})
        var model=users.get(userId)
        model.fetch({
            success:function(model, raw, options){
                cb.call(this, null, raw)
            },
            error:function(model, err, options){
                cb.call(this, err)
            }
        })
    }
}
