var CONST = require('const')

me.Class = Backbone.View.extend({
    initialize: function(options){
        var 
        self = this,
        model = options.model.attributes,
        value

        pico.embed(self.el, 'html/job.html', function(){
            for(var key in model){
                value = model[key]
                switch(key){
                case 'date':
                    self.$('input#'+key).val((new Date(value)).toLocaleDateString())
                    break
                case 'vehicle':
                    self.$('input#'+key).val(CONST.VEHICLES[value])
                    break
                case 'driver':
                    self.$('input#'+key).val(CONST.DRIVERS[value])
                    break
                case 'type':
                    self.$('input#'+key).val(CONST.JOB_TYPES[value])
                    break
                case 'payment':
                    self.$('input#'+key).val(CONST.PAYMENT_TYPES[value])
                    break
                case 'mobile':
                    self.$('a#mobile').attr('href', 'tel:'+value)
                    self.$('input#'+key).val(value)
                    break
                case 'pickup':
                    self.$('a#pickup').attr('href', 'geo:0,0?q='+value)
                    self.$('input#'+key).val(value)
                    break
                case 'dropoff':
                    self.$('a#dropoff').attr('href', 'geo:0,0?q='+value)
                    self.$('input#'+key).val(value)
                    break
                default:
                    self.$('input#'+key).val(value)
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
