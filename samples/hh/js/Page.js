me.Class = Backbone.View.extend({
    initialize: function(options){
        this.spec = options.spec
        this.header = options.header
        this.modules = {}

        var
        self = this,
        $el = this.$el

        this.spec.forEach(function(s){
            if ('module' === s.type) {
                var mod = self.modules[s.name] = new s.Class({name:s.name, host:self, spec:s.spec})
                $el.append('<div class=module id=mod'+s.name+'></div>')
            }
        })
    },
    render: function(){
        return this.$el
    },
    events: {
        'invalidate': 'drawModule'
    },
    drawModule: function(evt, mod){
        var $mod = this.$('#mod'+mod.name)
        if (!mod || !$mod.length) return

        $mod.html(mod.render())
    }
})
