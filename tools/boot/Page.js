var
loadModules = function(srcList, destList, pageOptions, cb){
    if (!srcList.length) return cb(null, destList)
    var
    src = srcList.pop(),
    name = src.name

    require('modules/'+name, function(err, mod){
        if (err) return cb(err)
        var options = {}

        src.fields.forEach(function(field){
            options[field.name] = ('@' === field.value[0]) ? pageOptions[field.value.substr(1)] : field.value
        })
        options['name'] = name
        desList[name] = new mod.Class(options)
        loadModules(srcList, destList, pageOptions, cb)
    })
}

me.Class = Backbone.View.extend({
    modules: null,
    initialize: function(options){
        var
        self = this,
        $el = this.$el

        options.modules.forEach(function(mod){
            $el.append('<div class=module id=mod'+mod.name+'></div>')
        })
        loadModules(options.modules, {}, options.data, function(err, modList){
            if (err) return console.error(err)
            self.modules = modList
        })
    },
    render: function(){
        return this.$el
    },
    events: {
        'invalidate': 'invalidate'
    },
    invalidate: function(evt, modName){
        this.$('#mod'+modName).html(this.modules[modName].render())
    }
})
