exports.Class = Backbone.Collection.extend({
    initialize: function(models, path){
        this.url = path.list
        this.model = Backbone.Model.extend({
            sync: function(method, model, options){
                var url = path[method]
                if (url){
                    options.url = url
                    return Backbone.sync(method, model, options)
                }
                return options.success()
            }
        })
        if (path.preload) this.fetch()
    }
})