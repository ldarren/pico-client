var
spec = require('spec'),
Router = require('Router')

me.Class = Backbone.View.extend({
    initialize: function(options, cb){
        this.name = options.name.toString()
        this.host = options.host
        var self = this
        spec.load(this.host, options.params || [], options.spec, function(err, s){
            if (err){
                console.warn(err)
                return Router.instance.navigate('', {trigger: true})
            }
            self.spec = s
            if (!cb) return
            cb(err, s)
        })
    },
    addSpec: function(spec){
        this.spec = (spec || []).concat(this.spec)
        return this.spec.slice()
    },
    createOptions: function(spec){
        return {
            name: this.name.toString(),
            host: this,
            spec: spec || []
        }
    },
    invalidate: function(){
        this.host.trigger('invalidate', this)
    }
}, Backbone.Events)
