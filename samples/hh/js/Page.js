var
loadModules = function(srcList, destList, pageOptions, cb){
    if (!srcList.length) return cb(null, destList)
    var
    self = this,
    src = srcList.pop(),
    name = src.name

    require('modules/'+name, function(err, mod){
        if (err) return cb(err)
        var
        options = {},
        fields = []

        src.fields.forEach(function(field){
            field.value = ('@' === field.value[0]) ? pageOptions[field.value.substr(1)] : field.value
            fields.push(field)
        })
        options['name'] = name
        options['host'] = self 
        options['fields'] = fields
        destList[name] = new mod.Class(options)
        loadModules.call(self, srcList, destList, pageOptions, cb)
    })
}

me.Class = Backbone.View.extend({
    modules: {},
    initialize: function(options){
        var
        self = this,
        $el = this.$el

        options.modules.forEach(function(mod){
            $el.append('<div class=module id=mod'+mod.name+'></div>')
        })

        loadModules.call(this, options.modules, {}, options.data, function(err, modList){
            if (err) return console.error(err)
            self.modules = modList
            self.render()
        })
    },
    render: function(){
        for(var k in this.modules){
            this.invalidate(null, k)
        }
        return this.$el
    },
    events: {
        'invalidate': 'invalidate'
    },
    invalidate: function(evt, modName){
        var
        $mod = this.$('#mod'+modName),
        mod = this.modules[modName]
        if (!mod || !$mod.length) return

        $mod.html(mod.render())
    }
})
