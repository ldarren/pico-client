var Field = Backbone.Model.extend({
    sync: function(method, model, options){
        if (!options.url){
            switch(method){
            case 'create': options.url = 'pico/field/create'; break
            case 'read': options.url = 'pico/field/read'; break
            case 'update': options.url = 'pico/field/update'; break
            case 'delete': options.url = 'pico/field/delete'; break
            }
        }
        Backbone.sync(method, model, options)
    }
})

me.Class = Backbone.Collection.extend({
    model: Field,
    url: 'pico/field/list'
})
