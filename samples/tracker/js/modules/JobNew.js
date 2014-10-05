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

        fields.push({label:'Pickup', name:'pickup', holder:'Pickup place', type:'text', required:true}) 
        fields.push({label:'Date', name:'date', type:'date', required: true}) 
        fields.push({label:'Time', name:'time', type:'time', required: true}) 
        fields.push({label:'Reason', name:'reason', type:'select', options:common.getJobType(), required: true}) 
        fields.push({label:'Dropoff', name:'dropoff', holder:'Dropoff place', type:'text', required: true}) 
        fields.push({label:'Payment', name:'payment', type:'select', options:common.getPaymentType(), required: true}) 

        this.$el.html(_.template(tpl.text, {hiddens:[{name:'type', value:'job'}], fields:fields}))
    },
    moduleEvents: function(evt, sender){
        switch(evt){
        case 'cancel': window.history.back(); break
        case 'ok':
            if (!this.el.checkValidity()) return alert('Missing info')
            this.data.create(null, {
                data: this.el,
                wait: true,
                success: function(model, data){
                    window.history.back();
                }
            })
            break
        default: Module.Class.prototype.moduleEvents.apply(this, arguments)
        }
    }
})
