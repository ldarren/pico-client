var
spec = require('spec'),
Router = require('Router'),
id=0

me.Class = Backbone.View.extend({
    init: function(options, cb){
        this.on('invalidate', this.drawModule)
        this.id = id++
        this.name = options.name
        this.host = options.host
        var self = this
        spec.load(this.host, options.params || [], options.spec, function(err, s){
            self.spec = s
            if (cb) cb(err, s)
        })
    },
    createSubModule: function(spec, params){
        if ('module' !== spec.type) return console.error('create a sub module with none module spec')
        return new spec.Class({name:spec.name, host:this, spec:spec.spec, params:params})
    },
    addSpec: function(spec){
        this.spec = (spec || []).concat(this.spec)
        return this.spec.slice()
    },
    invalidate: function(){
        this.host.trigger('invalidate', this)
    }
}, Backbone.Events)
