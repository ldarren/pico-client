var
specMgr = require('specMgr'),
Router = require('Router'),
Module = require('Module')

exports.Class = Backbone.View.extend(_.extend({
    initialize: function(options, params, host){

        this.style = restyle(options.styles, ['webkit'])
        this.host = host
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
        return this.el
    },
    remove: function(){
        this.off()
        Backbone.View.prototype.remove.apply(this, arguments)
        this.style.remove()
        for(var i=0,ms=this.modules,m; m=ms[i]; i++){
            m.remove()
        }
        ms.length = 0
        specMgr.unload(this.spec)
    },
    pageEvents: function(){
        var params = Array.prototype.slice.call(arguments)

        switch(params[0]){
        case 'invalidate': this.drawModule.apply(this, params.slice(1)); break
        default:
            var sender = params.splice(1, 1)
            this.triggerAll(params, sender)
            break
        }
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
}, Module.Events))
