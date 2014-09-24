var
specMgr = require('specMgr'),
id=0,
ModuleEvents = {
    triggerHost: function(){
        if (!this.host) return
        setTimeout(function(context, params){
            params.splice(1, 0, context)
            Backbone.Events.trigger.apply(context.host, params)
        }, 0, this, Array.prototype.slice.call(arguments))
    },
    triggerPage: function(){
        if (!this.currPage) return
        setTimeout(function(context, params){
            params.splice(1, 0, context)
            Backbone.Events.trigger.apply(context.currPage, params)
        }, 0, this, Array.prototype.slice.call(arguments))
    },
    triggerModule: function(mod){
        if (!mod) return
        setTimeout(function(context, params){
            params.splice(1, 0, context)
            Backbone.Events.trigger.apply(mod, params)
        }, 0, this, Array.prototype.slice.call(arguments, 1))
    },
    triggerModules: function(){
        setTimeout(function(context, params){
            var trigger = Backbone.Events.trigger

            params.splice(1, 0, context)
            for(var ms=context.modules,i=0,m; m=ms[i]; i++){
                trigger.apply(m, params)
            }
        }, 0, this, Array.prototype.slice.call(arguments))
    },
    triggerAll: function(params, excludes){
        if (!params) return
        if ('string' === typeof params){
            params = Array.prototype.slice.call(arguments)
            excludes = []
        }
        excludes = excludes || []
        setTimeout(function(context){
            var trigger = Backbone.Events.trigger
            params.splice(1, 0, context);
            [context.host, context.currPage, context.modal].forEach(function(view){
                if (view && -1 === excludes.indexOf(view)) trigger.apply(view, params)
            })
            if (context.modules){
                for(var ms=context.modules,i=0,m; m=ms[i]; i++){
                    if (-1 === excludes.indexOf(m)) trigger.apply(m, params)
                }
            }
        }, 0, this)
    }
}

exports.Events = _.extend(ModuleEvents, Backbone.Events)

exports.Class = Backbone.View.extend(_.extend({
    initialize: function(options){
        this.id = id++
        this.name = options.name
        this.host = options.host
        this.modules = []
        this.readiness = []
        this.rawSpec = options.spec
        this.existence = true

        this.on('all', this.moduleEvents, this)

        var self = this
        specMgr.load(this.host, options.params || [], options.spec, function(err, s){
            if (!self.existence) return self.remove()
            self.spec = s
            if (err) return console.error(err)
            self.create(s)
        })
    },
    create: function(spec){
    },
    remove: function(){
        this.existence = false
        this.off()
        Backbone.View.prototype.remove.apply(this, arguments)
        for(var i=0,ms=this.modules,m; m=ms[i]; i++){
            m.remove()
        }
        ms.length = 0
        specMgr.unload(this.rawSpec, this.spec)
    },
    proxy: function(mod, params, spec){
        if ('module' !== mod.type) return console.error('Wrong type!')
        var m = new mod.Class({name:mod.name, host:this, spec:spec ? mod.spec.concat(spec) : mod.spec, params:params})
        this.modules.push(m)
        return m
    },
    addSpec: function(spec){
        this.spec = (spec || []).concat(this.spec)
        return this.spec.slice()
    },
    require: function(name){
        var spec = this.spec
        for(var i=0,s; s=spec[i]; i++){
            if (name === s.name) return s
        }
    },
    requireAll: function(name){
        var
        arr = [],
        spec = this.spec
        for(var i=0,s; s=spec[i]; i++){
            if (name === s.name) arr.push(s)
        }
        return arr
    },
    requireType: function(type){
        var spec = this.spec
        for(var i=0,s; s=spec[i]; i++){
            if (type === s.type) return s
        }
    },
    requireAllType: function(type){
        var
        obj = {},
        spec = this.spec
        for(var i=0,s; s=spec[i]; i++){
            if (type === s.type) obj[s.name] = s
        }
        return obj
    },
    render: function(){
        var
        ms = this.modules,
        r = this.readiness,
        $el = this.$el
        for(var i=0,l=ms.length; i<l; i++){
            switch(r[i]){
            case 0: break
            case 1:
                r[i] = 0
                $el.append(ms[i].render())
                break
            default: return this.el
            }
        }
        return this.el
    },
    moduleEvents: function(evt, sender){
        switch(evt){
        case 'invalidate': this.readiness[this.modules.indexOf(sender)] = 1; break
        }
        var params = Array.prototype.slice.call(arguments)
        params.splice(1, 1)
        this.triggerAll(params, [sender])
    }
},ModuleEvents))
