var
spec = require('spec'),
id=0

me.Class = Backbone.View.extend({
    init: function(options, cb){
        this.id = id++
        this.name = options.name
        this.host = options.host
        this.modules = []

        this.on('all', this.moduleEvents, this)

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
    proxy: function(mod, params){
        if ('module' !== mod.type) return console.error('Wrong type!')
        var m = new mod.Class({name:mod.name, host:this, spec:mod.spec, params:params})
        this.modules.push(m)
        return m
    },
    addSpec: function(spec){
        this.spec = (spec || []).concat(this.spec)
        return this.spec.slice()
    },
    render: function(){
        var ms = this.modules
        switch(ms.length){
        case 0: return this.el
        case 1: return ms[0].render()
        default:
            var $el = this.$el
            for(var i=0,l=ms.length; i<l; i++){
                $el.append(ms[i].render())
            }
            return this.el
        }
    },
    moduleEvents: function(evt, sender){
        var params = Array.prototype.slice.call(arguments)
        params.splice(1, 1)
        this.triggerAll(params, [sender])
    },
    triggerHost: function(){
        setTimeout(function(context, params){
            params.splice(1, 0, context)
            Backbone.Events.trigger.apply(context.host, params)
        }, 0, this, Array.prototype.slice.call(arguments))
    },
    triggerModules: function(){
        setTimeout(function(context, params){
            var trigger = Backbone.Events.trigger

            params.splice(1, 0, context)
            for(var ms=context.modules,i=0,l=ms.length; i<l; i++){
                trigger.apply(ms[i], params)
            }
        }, 0, this, Array.prototype.slice.call(arguments))
    },
    triggerAll: function(params, excludes){
        setTimeout(function(context){
            var trigger = Backbone.Events.trigger
            params.splice(1, 0, context)
            if (-1 === excludes.indexOf(context.host)) trigger.apply(context.host, params)
            for(var m,ms=context.modules,i=0,l=ms.length,m=ms[i]; i<l; i++){
                if (-1 === excludes.indexOf(m)) trigger.apply(m, params)
            }
        }, 0, this)
    },
}, Backbone.Events)
