me.Class = Backbone.View.extend({
    initialize: function(options){
        var $el = this.$el

        this.spec = options.spec
        this.header = options.header
        this.modules = {}

        this.spec.forEach(function(s){
            self.modules[s.name] = new s.value.Class(s)
            if ('module' === s.type) $el.append('<div class=module id=mod'+s.name+'></div>')
        })
        this.render()
    },
    render: function(){
        var self = this
        this.spec.forEach(function(s){
            if ('module' === s.type) self.drawModule(null, s.name, self.modules[s.name])
        })
        return this.$el
    },
    events: {
        'invalidate': 'drawModule'
    },
    drawModule: function(evt, modName, mod){
        var $mod = this.$('#mod'+modName)
        if (!mod || !$mod.length) return

        $mod.html(mod.render())
    }
})
