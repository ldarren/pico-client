var spec = require('spec')

me.Class = Backbone.View.extend({
    initialize: function(options){
        this.on('invalidate', this.drawModule)

        this.spec = options.spec
        this.header = options.header
        this.style = restyle(options.styles, ['webkit'])
        this.modules = []

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
    drawModule: function(mod){
        var $mod = this.$('#mod'+mod.name)
        if (!mod || !$mod.length) return

        $mod.html(mod.render())
    }
}, Backbone.Events)
