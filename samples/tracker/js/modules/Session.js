var
Module = require('Module'),
Router = require('Router'),
network = require('network'),
storage = window.localStorage,
cacheWrite = function(model, coll){
    var cred = model.attributes
    network.signalStep('addon', [cred]) 
    storage.setItem('owner', JSON.stringify(cred))
    Router.instance().home(true)
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
        network.slot('error', this.onNetworkError, this)

        if(cache){
            try{ owner.add(JSON.parse(cache)) }
            catch(exp){ console.error(exp) }
        }
    },
    onNetworkError: function(err){
        if (403 !== err.code) return
        this.owner.reset()
        Router.instance().nav('signin')
    },
    moduleEvents: function(evt, sender){
        switch(evt){
        case 'changeRoute':
            if (!this.owner.length && -1 === this.authPages.indexOf(arguments[2])) Router.instance().nav('signin')
            break
        }
    }
})
