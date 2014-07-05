var
CONST = require('const'),
tpl = require('@html/job.html')

me.Class = Backbone.View.extend({
    model: null,
    initialize: function(options){
        this.model = options.model
    },

    header: function(){
        return {
            title: 'Job',
            left: ['left-nav'],
        }
    },

    render: function(){
        this.el.innerHTML = tpl.text

        var 
        model = this.model.attributes,
        value

        for(var key in model){
            value = model[key]
            switch(key){
            case 'date':
                this.$('input#'+key).val((new Date(value)).toLocaleDateString())
                break
            case 'vehicle':
                this.$('input#'+key).val(CONST.VEHICLES[value])
                break
            case 'driver':
                this.$('input#'+key).val(CONST.DRIVERS[value])
                break
            case 'type':
                this.$('input#'+key).val(CONST.JOB_TYPES[value])
                break
            case 'payment':
                this.$('input#'+key).val(CONST.PAYMENT_TYPES[value])
                break
            case 'mobile':
                this.$('a#mobile').attr('href', 'tel:'+value)
                this.$('input#'+key).val(value)
                break
            case 'pickup':
                this.$('a#pickup').attr('href', 'geo:0,0?q='+value)
                this.$('input#'+key).val(value)
                break
            case 'dropoff':
                this.$('a#dropoff').attr('href', 'geo:0,0?q='+value)
                this.$('input#'+key).val(value)
                break
            default:
                this.$('input#'+key).val(value)
            }
        }
        return this
    }
})
