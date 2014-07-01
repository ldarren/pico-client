var
KEY = 'vipUser',
defaults = {
    id: undefined,
    follows:[]
}

me.Class = Backbone.Model.extend({

    defaults: window.localStorage[KEY] || defaults,

    initialize: function(){
        this.on('change', function(model, changed){
            window.localStorage[KEY] = model.attributes
        })
    },

    sync: function(method, model, options){
        if ('CREATE' === method.toUpperCase()) {
            options.url = 'vip/user/create'
            return Backbone.sync(method, model, options)
        }
        if (!model.id) return options.success()
    },

    validate: function(attributes, options){
    }
})
