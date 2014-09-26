var
Module = require('Module'),
Router = require('Router'),
network = require('network'),
storage = window.localStorage,
cacheWrite = function(model, coll){
    var cred = model.attributes
    network.signalStep('addon', [cred]) 
    storage.setItem('owner', JSON.stringify(cred))
    if (-1 !== this.authPages.indexOf(Router.instance().currPath())) Router.instance().home(true)
},
cacheRemove = function(model, coll){
    network.signalStep('addon', []) 
    storage.removeItem('owner')
    if (-1 === this.authPages.indexOf(Router.instance().currPath())) Router.instance().nav(this.authPages[0])
}

exports.Class = Module.Class.extend({
    create: function(spec){
        var
        owner = this.require('owner').value,
        cache = storage.getItem('owner')

        this.authPages = this.require('authPages').value

        owner.reset()
        this.owner = owner
        this.listenTo(owner, 'add', cacheWrite)
        this.listenTo(owner, 'remove', cacheRemove)
        network.slot('error', this.onNetworkError, this)

        if(cache){
            try{ owner.add(JSON.parse(cache)) }
            catch(exp){ console.error(exp) }
        }
    },
    onNetworkError: function(err){
        if (403 !== err.code) return
        this.owner.reset()
        Router.instance().nav(this.authPages[0])
    },
    moduleEvents: function(evt, sender){
        switch(evt){
        case 'changeRoute':
            if (!this.owner.length && -1 === this.authPages.indexOf(arguments[2])) Router.instance().nav(this.authPages[0])
            break
        }
    }
})
