me.Class = Backbone.View.extend({
    initialize: function(options){
        this.name = options.name.toString()
        this.host = options.host
        this.spec= options.spec.slice()
        return options.sepc
    },
    addOptions: function(spec){
        return {
            name: this.name.toString(),
            host: this.host,
            spec: (spec || []).concat(this.spec.slice())
        }
    },
    createOptions: function(spec){
        return {
            name: this.name.toString(),
            host: this.host,
            spec: spec || []
        }
    },
    invalidate: function(){
        this.host.$el.trigger('invalidate', this.name, this)
    }
})
