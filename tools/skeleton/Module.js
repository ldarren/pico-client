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
            if (err) console.error(err)
            if (cb) cb(err, s)
        })
    },
    derive: function(mod, params){
        if ('module' !== mod.type) return console.error('Wrong type!')
        return new mod.Class({name:mod.name, host:this, spec:mod.spec, params:params})
    },
    addSpec: function(spec){
        this.spec = (spec || []).concat(this.spec)
        return this.spec.slice()
    },
    invalidate: function(){
        this.host.trigger('invalidate', this)
    }
}, Backbone.Events)
