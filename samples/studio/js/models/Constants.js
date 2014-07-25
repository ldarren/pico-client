var Spec = Backbone.Model.extend({
    sync: function(method, model, options){
        if (!options.url){
            switch(method){
            case 'create': options.url = 'pico/spec/create'; break
            case 'read': options.url = 'pico/spec/read'; break
            case 'update': options.url = 'pico/spec/update'; break
            case 'delete': options.url = 'pico/spec/delete'; break
            }
        }
        Backbone.sync(method, model, options)
    }
})

exports.instance = new (Backbone.Collection.extend({
    model: Spec,
    url: 'pico/constant/list',
    initialize: function(){
        this.fetch()
    }
}))
