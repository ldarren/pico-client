var
Module = require('Module'),
Router = require('Router'),
network = require('network'),
storage = window.localStorage,
cache = function(model, coll){
    var cred = model.attributes
    network.signalStep('addon', [cred]) 
    storage.setItem('owner', JSON.stringify(cred))
    this.triggerHost('signin', model)

    userReady.call(this, model)
},
uncache = function(model, coll){
    this.triggerHost('signout')
    storage.removeItem('owner')
    network.signalStep('addon', []) 

    // signout
    this.listenTo(this.data, 'add', userAdded)
    if (-1 === this.authPages.indexOf(Router.instance.currPath())) Router.instance.nav(this.authPages[0])
},
userReady = function(model){
    var user = this.data.get(model.id)
    if (!user) return
    this.stopListening(this.data, 'add')
    this.triggerHost('userReady', user)
    if (-1 !== this.authPages.indexOf(Router.instance.currPath())) Router.instance.home(true)
},
userAdded = function(model){
    if (model.id !== this.owner.models[0].id) return
    this.stopListening(this.data, 'add')
    if (this.owner.length) userReady.call(this, this.owner.models[0])
}

exports.Class = Module.Class.extend({
    create: function(spec){
        var
        owner = this.require('owner').value,
        cached = storage.getItem('owner')

        this.data = this.require('data').value,
        this.authPages = this.require('authPages').value

        owner.reset()
        this.owner = owner
        this.listenTo(owner, 'add', cache)
        this.listenTo(owner, 'remove', uncache)
        this.listenTo(this.data, 'add', userAdded)
        network.slot('error', this.onNetworkError, this)

        if(cached){
            try{ owner.add(JSON.parse(cached)) }
            catch(exp){ console.error(exp) }
        }
    },
    onNetworkError: function(err){
        if (403 !== err.code) return
        this.owner.reset()
        Router.instance.nav(this.authPages[0])
    },
    moduleEvents: function(evt, sender){
        switch(evt){
        case 'changeRoute':
            if (!this.owner.length && -1 === this.authPages.indexOf(arguments[2])) Router.instance.nav(this.authPages[0])
            break
        }
    }
})
