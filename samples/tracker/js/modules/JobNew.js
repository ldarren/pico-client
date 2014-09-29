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

        fields.push({label:'Plate #', name:'tag', holder:'PA1234A', type:'text'}) 
        fields.push({label:'Seater', name:'seater', holder:13, type:'number'}) 
        fields.push({label:'Model', name:'model', holder:'ALPHARD', type:'text'}) 

        this.$el.html(_.template(tpl.text, {hiddens:[{name:'type', value:'vehicle', type:'hidden'}], fields:fields}))
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
