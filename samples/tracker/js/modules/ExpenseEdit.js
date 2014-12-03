var
Module = require('Module'),
Router = require('Router'),
tpl = require('@html/Edit.html'),
common = require('modules/common')

exports.Class = Module.Class.extend({
    tagName: 'form',
    className: 'input-group card',
    attributes:{ 'action': 'tr/data/update' },
    create: function(spec){
        var
        data = this.require('data').value,
        month = this.require('month').value,
        date = this.require('date').value,
        expense = data.findWhere({month:month}),
        hiddens=[{name:'month', value:month},{name:'date', value:date},{name:'type', value:'expense'}],
        fields = [],
        spend = 0

        if (expense){
            hiddens.push({name:'dataId', value:expense.id, type:'hidden'})
            var spends = expense.get('date').split(',')
            spend = spends[date] || 0
        }else{
            this.el.setAttribute('action', 'tr/data/create')
        }

        fields.push({label:'$', name:'expense', value:spend, type:'number'}) 

        this.triggerHost('changeHeader', {title:'Expense: '+month+'-'+String('0'+date).slice(-2)})

        this.expense = expense
        this.data=data 
        this.$el.html(_.template(tpl.text, {hiddens:hiddens, fields:fields}))
    },
    moduleEvents: function(evt, sender){
        switch(evt){
        case 'cancel': Router.instance.back(); break
        case 'ok':
            if (this.expense){
                this.expense.save(null, {
                    data: this.el,
                    success: function(model, data){
                        Router.instance.back();
                    }
                })
            }else{
                this.data.create(null, {
                    data: this.el,
                    success: function(model, data){
                        Router.instance.back();
                    }
                })
            }
            break
        default: Module.Class.prototype.moduleEvents.apply(this, arguments)
        }
    }
})
