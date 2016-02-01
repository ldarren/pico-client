var
Router = require('js/Router'),
network = require('js/network'),
storage = window.localStorage,
changed=function(model){
    var cred = this.credential(model.attributes)
    network.addon(cred) 
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
        return userReady(null, user, this)
    }
    this.addUser(model.id, users, userReady)
},
uncache = function(){
    storage.removeItem('owner')
    network.addon([]) 
    this.signals.signout().send()
},      
userReady = function(err, user, ctx){
    if (err) return console.error(err)
    if (!user) return console.error('user not found')

    if (!ctx.userReadied || brief.hasChanged(['id'])) ctx.signals.userReady(user).dispatch()
	ctx.userReadied= true
    if (!ctx.modelReadied)ctx.signals.modelReady().send()
    ctx.modelReadied= true
    // always home page after login? Router.home(true)
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
        users: 'ref'
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
            this.signals.signout().send()
        }
    },
    // welcome to override with mixin
    addUser: function(userId, users, cb){
        var self=this
        users.read({}, function(err, model, raw){
            cb(err, raw, self)
        })
    },
    credential: function(att){
        return {id:att.id, sess:att.sess}
    }
}
