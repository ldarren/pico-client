var Project = Backbone.Model.extend({
    sync: function(method, model, options){
        if (!options.url){
            switch(method){
            case 'create': options.url = 'pico/project/create'; break
            case 'read': options.url = 'pico/project/read'; break
            case 'update': options.url = 'pico/project/update'; break
            case 'delete': options.url = 'pico/project/remove'; break
            }
        }
        Backbone.sync(method, model, options)
    }
})

exports.Class = Backbone.Collection.extend({
    model: Project,
    url: 'pico/project/list'
})
