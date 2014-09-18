var
Module = require('Module'),
Router = require('Router'),
network = require('network'),
storage = window.localStorage,
cacheWrite = function(model, coll){
    var cred = model.attributes
    network.signalStep('addon', [cred]) 
    storage.setItem('owner', JSON.stringify(cred))
    this.data.fetch({
        data:{id:cred.id},
        success: function(){
            Router.instance().nav('', true)
        }
    })
}

exports.Class = Module.Class.extend({
    create: function(spec){
        var
        owner = this.require('owner').value,
        cache = storage.getItem('owner')

        this.data = this.require('data').value

        owner.reset()
        if(cache)owner.add(cache)
        this.owner = owner
        this.listenTo(owner, 'add', cacheWrite)
        network.slot('error', this.onNetworkError, this)
    },
    onNetworkError: function(err){
        if (401 !== err.code) return
        this.owner.reset()
        Router.instance().nav('signin')
    },
    moduleEvents: function(evt, sender){
        switch(evt){
        case 'changeRoute':
            if ('signin' !== arguments[2] && !this.owner.length) Router.instance().nav('signin')
            break
        }
    }
})
