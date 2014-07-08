var Widget = Backbone.Model.extend({
    sync: function(method, model, options){
        if (!options.url){
            switch(method){
            case 'create': options.url = 'pico/page/create'; break
            case 'read': options.url = 'pico/page/read'; break
            case 'update': options.url = 'pico/page/update'; break
            case 'delete': options.url = 'pico/page/delete'; break
            }
        }
        Backbone.sync(method, model, options)
    }
})

me.Class = Backbone.Collection.extend({
    model: Widget,
    url: 'pico/page/list'
})
