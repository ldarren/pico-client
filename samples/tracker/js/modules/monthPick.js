var
Module = require('Module'),
Router = require('Router'),
tpl = require('@html/Edit.html'),
common = require('modules/common')

exports.Class = Module.Class.extend({
    tagName: 'form',
    className: 'input-group card',
    create: function(spec){
        var
        fields = [], hiddens=[],
        now = new Date()

        fields.push({label:'Month', value:now.getFullYear()+'-'+(now.getMonth()+1), name:'month', type:'month', required:true}) 

        this.$el.html(_.template(tpl.text, {hiddens:hiddens, fields:fields}))
    },
    moduleEvents: function(evt, sender){
        switch(evt){
        case 'cancel': Router.instance.back(); break
        case 'ok':
            if (!this.el.checkValidity()) return alert('Missing params')
            var form = this.el.elements
            Router.instance.go('expenses/'+(form['month'].value))
            break
        default: Module.Class.prototype.moduleEvents.apply(this, arguments)
        }
    }
})
