me.Class = Backbone.View.extend({
    initialize: function(options){
        this.name = options.name.toString()
        this.host = options.host
        this.spec = options.value.slice()
        return options.value 
    },
    addOptions: function(spec){
        return {
            name: this.name.toString(),
            host: this,
            value: (spec || []).concat(this.spec.slice())
        }
    },
    createOptions: function(spec){
        return {
            name: this.name.toString(),
            host: this,
            value: spec || []
        }
    },
    invalidate: function(){
        this.host.$el.trigger('invalidate', this.name, this)
    }
})
