me.Class = Backbone.View.extend({
    initialize: function(options){
        var 
        self = this,
        model = options.model.attributes;

        pico.embed(self.el, 'html/job.html', function(){
            for(var key in model){
                self.$('input#'+key).val(model[key]);
            }
        })
    },

    getHeader: function(){
        return {
            title: 'Job',
            left: 'left-nav',
        }
    },

    render: function(){
        return this
    }
})
