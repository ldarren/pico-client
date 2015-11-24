var Widget = Backbone.Model.extend({
    sync: function(method, model, options){
        if (!options.url){
            switch(method){
            case 'create': options.url = 'pico/widget/create'; break
            case 'read': options.url = 'pico/widget/read'; break
            case 'update': options.url = 'pico/widget/update'; break
            case 'delete': options.url = 'pico/widget/remove'; break
            }
        }
        Backbone.sync(method, model, options)
    }
})

exports.Class = Backbone.Collection.extend({
    model: Widget,
    url: 'pico/widget/list'
})
