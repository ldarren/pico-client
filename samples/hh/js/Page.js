me.Class = Backbone.View.extend({
    initialize: function(options){
        this.on('invalidate', this.drawModule)

        this.spec = options.spec
        this.header = options.header
        this.modules = {}

        var
        self = this,
        $el = this.$el,
        index = 0,
        modName

        this.spec.forEach(function(s){
            if ('module' === s.type) {
                modName = s.name + index++
                $el.append('<div class=module id=mod'+modName+'></div>')
                self.modules[modName] = new s.Class({name:modName, host:self, spec:s.spec})
            }
        })
    },
    render: function(){
        return this.$el
    },
    drawModule: function(mod){
        var $mod = this.$('#mod'+mod.name)
        if (!mod || !$mod.length) return

        $mod.html(mod.render())
    }
}, Backbone.Events)
