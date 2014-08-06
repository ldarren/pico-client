var
spec = require('spec'),
id=0

me.Class = Backbone.View.extend({
    init: function(options, cb){
        this.on('invalidate', this.drawModule)
        this.id = id++
        this.name = options.name
        this.host = options.host
        this.modules = []
        var self = this
        spec.load(this.host, options.params || [], options.spec, function(err, s){
            self.spec = s
            if (err) console.error(err)
            if (cb) cb(err, s)
        })
    },
    remove: function(){
        this.off()
        Backbone.View.prototype.remove.apply(this, arguments)
        var ms = this.modules
        for(var i=0,l=ms.length; i<l; i++){
            ms[i].remove()
        }
        ms.length = 0
        spec.unload(this.spec)
    },
    derive: function(mod, params){
        if ('module' !== mod.type) return console.error('Wrong type!')
        var m = new mod.Class({name:mod.name, host:this, spec:mod.spec, params:params})
        this.modules.push(m)
        return m
    },
    addSpec: function(spec){
        this.spec = (spec || []).concat(this.spec)
        return this.spec.slice()
    },
    invalidate: function(){
        this.host.trigger('invalidate', this)
    }
}, Backbone.Events)
