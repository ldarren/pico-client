me.Class = Backbone.View.extend({
    name: '',
    host: null,
    fields: null,
    initialize: function(options){
        this.name = options.name.toString()
        this.host = options.host
        this.fields = options.fields.slice()
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
