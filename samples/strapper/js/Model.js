exports.Class = Backbone.Collection.extend({
    initialize: function(models, config){
        this.url = config.list
        this.sync = function(method, model, options){
            options.channel = config.channel
            var url = options.url || this.url || config[method]
            if (url){
                options.url = url
                return Backbone.sync(method, model, options)
            }
            return options.success()
        }
        this.model = Backbone.Model.extend({
            idAttribute: config.idAttribute || 'id',
            sync: this.sync
        })
        if (config.preload) this.fetch()
    }
})