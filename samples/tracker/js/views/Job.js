var CONST = require('const');

me.Class = Backbone.View.extend({
    initialize: function(options){
        var 
        self = this,
        model = options.model.attributes;

        pico.embed(self.el, 'html/job.html', function(){
            for(var key in model){
                switch(key){
                case 'date':
                    self.$('input#'+key).val((new Date(model[key])).toLocaleDateString())
                    break
                case 'vehicle':
                    self.$('input#'+key).val(CONST.VEHICLES[model[key]])
                    break
                case 'driver':
                    self.$('input#'+key).val(CONST.DRIVERS[model[key]])
                    break
                case 'type':
                    self.$('input#'+key).val(CONST.JOB_TYPES[model[key]])
                    break
                case 'payment':
                    self.$('input#'+key).val(CONST.PAYMENT_TYPES[model[key]])
                    break
                default:
                    self.$('input#'+key).val(model[key]);
                }
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
