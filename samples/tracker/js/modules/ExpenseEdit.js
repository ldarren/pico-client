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
        expenses = data.findWhere({month:month}),
        spends = this.require('spends').value,
        hiddens=[{name:'month', value:month, type:'hidden'},{name:'date', value:date, type:'hidden'}],
        fields = [],
        spend = 0

        if (expenses){
            hiddens.push({name:'dataId', value:expenses.id, type:'hidden'})
            var spendModel = spends.findWhere({id:expenses.id})
            if (spendModel) spend = spendModel.get('json')
        }

        fields.push({label:'$', name:'expense', value:spend, type:'number'}) 

        this.triggerHost('changeHeader', {title:'Expense: '+month+'-'+String('0'+date).slice(-2)})

        this.expenses = expenses
        this.data=data 
        this.$el.html(_.template(tpl.text, {hiddens:hiddens, fields:fields}))
    },
    moduleEvents: function(evt, sender){
        switch(evt){
        case 'cancel': Router.instance.back(); break
        case 'ok':
            if (this.expenses){
                this.expenses.save(null, {
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
