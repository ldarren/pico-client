exports.Class = Backbone.Collection.extend({
    initialize: function(models, config){
        this.url = config.list
        this.model = Backbone.Model.extend({
            idAttribute: config.idAttributei || 'id',
            sync: function(method, model, options){
                var url = config[method]
                if (url){
                    options.url = url
                    return Backbone.sync(method, model, options)
                }
                return options.success()
            }
        })
        if (config.preload) this.fetch()
    }
})
