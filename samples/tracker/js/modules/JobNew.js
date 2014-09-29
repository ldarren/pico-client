var
Module = require('Module'),
Router = require('Router'),
tpl = require('@html/Edit.html'),
common = require('modules/common')

exports.Class = Module.Class.extend({
    tagName: 'form',
    className: 'input-group card',
    attributes:{ 'action': 'tr/data/create' },
    create: function(spec){
        var fields = []

        this.data = this.require('data').value,

        fields.push({label:'Pickup', name:'pickup', holder:'Pickup place', type:'text'}) 
        fields.push({label:'Date', name:'date', holder:'Pickup date', type:'date'}) 
        fields.push({label:'Time', name:'date', holder:'Pickup time', type:'time'}) 
        fields.push({label:'Reason', name:'reason', type:'select', options:common.getJobType()}) 
        fields.push({label:'Dropoff', name:'dropoff', holder:'Dropoff place', type:'text'}) 
        fields.push({label:'Payment', name:'payment', type:'select', options:common.getPaymentType()}) 

        this.$el.html(_.template(tpl.text, {hiddens:[{name:'type', value:'job', type:'hidden'}], fields:fields}))
    },
    moduleEvents: function(evt, sender){
        switch(evt){
        case 'cancel': window.history.back(); break
        case 'ok':
            this.data.create(null, {
                data: this.el,
                success: function(model, data){
                    window.history.back();
                }
            })
            break
        default: Module.Class.prototype.moduleEvents.apply(this, arguments)
        }
    }
})
