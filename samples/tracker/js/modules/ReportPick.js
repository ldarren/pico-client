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
        yest = new Date(),
        today = yest.toISOString().slice(0, 10)

        yest.setDate(1);
        yest.setMonth(yest.getMonth()-1);

        fields.push({label:'From', value:yest.toISOString().slice(0, 10), name:'from', type:'date', required:true}) 
        fields.push({label:'To', value:today, name:'to', type:'date', required:true}) 
        fields.push({label:'Type', name:'type', type:'select', options:common.getInvoiceType(), required:true}) 

        this.$el.html(_.template(tpl.text, {hiddens:hiddens, fields:fields}))
    },
    events: {
        'change select': 'fixDates',
        'change input': 'fixDates'
    },
    moduleEvents: function(evt, sender){
        switch(evt){
        case 'cancel': Router.instance.back(); break
        case 'ok':
            if (!this.el.checkValidity()) return alert('Missing params')
            var form = this.el.elements
            Router.instance.go('report/'+(form['type'].value)+'/'+(form['from'].value)+'/'+(form['to'].value))
            break
        default: Module.Class.prototype.moduleEvents.apply(this, arguments)
        }
    },
    fixDates: function(e){
        var
        form = this.el.elements,
        type = form['type'].selectedIndex,
        fromEle = form['from'],
        toEle = form['to'],
        from = fromEle.value

        if (!from || type < 3 || type > 4) return

        var
        date = new Date(from),
        yr = date.getFullYear(),
        mt = ('0'+(date.getMonth()+1)).slice(-2)

        fromEle.value = yr + '-' + mt + '-' + '01'
        toEle.value = yr + '-' + mt + '-' + common.daysInMonth(mt-1, yr)
    }
})
