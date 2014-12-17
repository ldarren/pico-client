var
Module = require('Module'),
Router = require('Router'),
addRow = function(model){
    this.spawn(this.Row, [model.id])
}

exports.Class = Module.Class.extend({
    tagName: 'ul',
    className: 'table-view',
    create: function(spec){
        var
        expenseItems = this.require('expenseItems').value,
        data = this.require('data').value,
        month = this.require('month').value,
        date = this.require('date').value,
        expense = data.findWhere({month:month}),
        spends = [],
        items = []

        if (expense && expense.has('date')){
            try{ spends = JSON.parse(expense.get('date'))}
            catch(exp){}

            items = spends[date] || []
        }

        this.items = items
        this.month = month
        this.date = date

        this.Row = this.require('ExpenseItem')

        this.listenTo(expenseItems, 'add', addRow)

        for(var i=0, item; item=items[i]; i++){
            expenseItems.add({id:i, desc:item[0], value:item[1]})
        }
    },
    moduleEvents: function(evt, sender){
        switch(evt){
        case 'plus':
            Router.instance.go('expense/edit/'+this.month+'/'+this.date+'/'+this.items.length);
            break
        default: Module.Class.prototype.moduleEvents.apply(this, arguments)
        }
    }
})
