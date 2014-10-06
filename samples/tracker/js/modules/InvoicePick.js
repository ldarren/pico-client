var
Module = require('Module'),
Router = require('Router'),
tpl = require('@html/Edit.html'),
common = require('modules/common')

exports.Class = Module.Class.extend({
    tagName: 'form',
    className: 'input-group card',
    attributes:{ 'action': 'tr/invoice/read' },
    create: function(spec){
        this.invoice = this.require('invoice').value
        var fields = [], hiddens=[]

        fields.push({label:'From', name:'from', type:'date'}) 
        fields.push({label:'To', name:'to', type:'date'}) 
        fields.push({label:'Type', name:'type', type:'select', options:common.getInvoiceType()}) 

        this.$el.html(_.template(tpl.text, {hiddens:hiddens, fields:fields}))
    },
    moduleEvents: function(evt, sender){
        switch(evt){
        case 'cancel': window.history.back(); break
        case 'ok':
            this.invoice.fetch({
                data: this.el,
                success: function(model, data){
                    debugger
                }
            })
            break
        default: Module.Class.prototype.moduleEvents.apply(this, arguments)
        }
    }
})
