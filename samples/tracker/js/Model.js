exports.Class = Backbone.Collection.extend({
    initialize: function(models, config){
        this.sync = function(method, cont, options){
            var url = options.url || cont.model ? config.list : config[method]
            if (url){
                options.url = url
                return Backbone.sync(method, cont, options)
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
