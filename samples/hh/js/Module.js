me.Class = Backbone.View.extend({
    name: '',
    host: null,
    options: null,
    initialize: function(options){
        this.name = options.name
        this.host = options.host
        this.options = options
        return options.fields
    },
    getOptions: function(fields){
        return {
            name: this.name.toString(),
            host: this.host,
            fields: (fields || []).concat(this.fields.slice())
        }
    },
    invalidate: function(){
        this.host.$el.trigger('invalidate', this.name)
    }
})
