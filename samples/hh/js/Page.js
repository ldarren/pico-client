var spec = require('spec')

me.Class = Backbone.View.extend({
    initialize: function(options){

        this.spec = options.spec
        this.header = options.header
        this.style = restyle(options.styles, ['webkit'])
        this.modules = []

        this.on('all', this.pageEvents, this)

        var
        self = this,
        $el = this.$el,
        index = 0,
        modName

        this.spec.forEach(function(s){
            if ('module' === s.type) {
                modName = s.name +'-'+ index++
                $el.append('<div class=module id=mod'+modName+'></div>')
                self.modules.push(new s.Class({name:modName, host:self, spec:s.spec}))
            }
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
        spec.unload(this.spec)
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
        var $mod = this.$('#mod'+mod.name)
        if (!$mod.length) return

        $mod.html(mod.render())
    }
}, Backbone.Events)
