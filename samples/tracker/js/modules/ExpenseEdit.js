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
        itemId = this.require('item').value,
        expense = data.findWhere({month:month}),
        hiddens=[{name:'month', value:month},{name:'date', value:date},{name:'type', value:'expense'}],
        fields = [],
        items = [],
        item  = []

        if (expense){
            hiddens.push({name:'dataId', value:expense.id, type:'hidden'})
            if (expense.has('date')){
                try{
                    items = JSON.parse(expense.get('date'))
                    item = items[itemId]
                }catch(exp){}
            }
        }else{
            this.el.setAttribute('action', 'tr/data/create')
        }

        fields.push({label:'Remarks', name:'desc', value:item[0], type:'text'},{label:'$', name:'value', value:item[1], type:'number'}) 

        this.triggerHost('changeHeader', {title:'Expense: '+month+'-'+String('0'+date).slice(-2)})

        this.expense = expense
        this.data=data 
        this.items = items
        this.itemId = itemId
        this.$el.html(_.template(tpl.text, {hiddens:hiddens, fields:fields}))
    },
    moduleEvents: function(evt, sender){
        switch(evt){
        case 'cancel': Router.instance.back(); break
        case 'ok':
            if(!this.el.checkValidity()) return alert('Missing Params')
            var
            el = this.el,
            data = {
                dataId: el.dataId ? el.dateId.value : undefined,
                month: el.month.value,
                date: el.date.value,
                type: el.type.value,
                json: this.items

            }
            this.items[this.itemId] = [el.desc.value, el.value.value]
            if (this.expense){
                this.expense.save(null, {
                    data: data,
                    success: function(model, data){
                        Router.instance.back();
                    }
                })
            }else{
                this.data.create(null, {
                    data: data,
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
