me.Class = Backbone.View.extend({
    initialize: function(options){
        this.on('invalidate', this.drawModule)

        this.spec = options.spec
        this.header = options.header
        this.modules = {}

        var
        self = this,
        $el = this.$el

        this.spec.forEach(function(s){
            if ('module' === s.type) {
                $el.append('<div class=module id=mod'+s.name+'></div>')
                var mod = self.modules[s.name] = new s.Class({name:s.name, host:self, spec:s.spec})
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
