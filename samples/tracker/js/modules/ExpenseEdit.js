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
        date = parseInt(this.require('date').value),
        itemId = this.require('item').value,
        expense = data.findWhere({month:month}),
        hiddens=[{name:'month', value:month},{name:'type', value:'expense'}],
        fields = [],
        spends = [],
        items = [],
        item  = []

        if (expense){
            hiddens.push({name:'dataId', value:expense.id, type:'hidden'})
            if (expense.has('date')){
                try{
                    spends = JSON.parse(expense.get('date'))
                    items = spends[date] || []
                    item = items[itemId] || []
                }catch(exp){}
            }
        }else{
            this.el.setAttribute('action', 'tr/data/create')
        }

        fields.push({label:'Remarks', name:'desc', value:item[0], type:'text'},{label:'$', name:'value', value:item[1], type:'number'}) 

        this.triggerHost('changeHeader', {title:'Expense: '+month+'-'+String('0'+(date+1)).slice(-2)})

        this.expense = expense
        this.data=data
        this.date = date
        this.spends = spends
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
                dataId: el.dataId ? el.dataId.value : undefined,
                month: el.month.value,
                type: el.type.value,
                json: this.spends
            }
            var
            items = this.spends[this.date] || [],
            item = [el.desc.value, parseFloat(el.value.value)]

            items[this.itemId] = item
            this.spends[this.date] = items

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
