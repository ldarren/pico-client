var
specMgr = require('specMgr'),
Router = require('Router')

exports.Class = Backbone.View.extend({
    initialize: function(options, params, host){

        this.header = options.header
        this.style = restyle(options.styles, ['webkit'])
        this.modules = []
        this.readiness = []

        this.on('all', this.pageEvents, this)

        var self = this

        specMgr.load(host, params, options.spec, function(err, spec){
            if (err){
                console.warn(err)
                return Router.instance().home()
            }
            self.spec = spec

            spec.forEach(function(s){
                if ('module' === s.type) {
                    self.modules.push(new s.Class({name:s.name, host:self, spec:s.spec, params:params}))
                }
            })
        })
    },
    render: function(){
        return this.$el
    },
    remove: function(){
        this.off()
        Backbone.View.prototype.remove.apply(this, arguments)
        this.style.remove()
        var ms = this.modules
        for(var i=0,l=ms.length; i<l; i++){
            ms[i].remove()
        }
        ms.length = 0
        specMgr.unload(this.spec)
    },
    pageEvents: function(){
        var params = Array.prototype.slice.call(arguments)

        switch(params[0]){
            case 'invalidate': this.drawModule.apply(this, params.slice(1)); break
            default:
                this.triggerModules.apply(this, params)
                break
        }
    },
    triggerModules: function(){
        setTimeout(function(context, params){
            var
            trigger = Backbone.Events.trigger,
            sender = params.splice(1, 0, this)[0]

            for(var m,ms=this.modules,i=0,l=ms.length; i<l,m=ms[i]; i++){
                if (sender === m) continue
                trigger.apply(m, params)
            }
        }, 0, this, Array.prototype.slice.call(arguments))
    },
    drawModule: function(mod){
        if (!mod) return

        var 
        $el = this.$el,
        r = this.readiness,
        ms = this.modules,
        index = ms.indexOf(mod),
        i,l

        r[index] = 1
        // all previous modules readied?
        for(i=0,l=index+1; i<l; i++){
            if (undefined === r[i]) return
        }
        // render all readied modules in seq
        for(i=0,l=r.length; i<l; i++){
            switch(r[i]){
            case 0: break
            case 1:
                r[i] = 0
                $el.append(ms[i].render())
                break
            default: return
            }
        }
    }
}, Backbone.Events)
