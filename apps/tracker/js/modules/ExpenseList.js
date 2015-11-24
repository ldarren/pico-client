var
Module = require('Module'),
common = require('modules/common'),
addRow = function(model){
    this.spawn(this.Row, [model.id])
}

exports.Class = Module.Class.extend({
    tagName: 'ul',
    className: 'table-view',
    create: function(spec){
        var
        expenses = this.require('expenses').value,
        data = this.require('data').value,
        month = this.require('month').value,
        then = new Date(month),
        expense = data.findWhere({month:month}),
        date = []

        if (expense && expense.has('date')){
            try{ date = JSON.parse(expense.get('date'))}
            catch(exp){}
        }

        this.Row = this.require('ExpenseRow')

        this.listenTo(expenses, 'add', addRow)

        for(var i=0,l=common.daysInMonth(then.getMonth(), then.getFullYear()), list, total, j, e; i<l; i++){
            list = date[i]
            total = 0
            if (list) for(j=0; e=list[j]; j++) total += e[1];
            expenses.add({id:i, value:total})
        }
    }
})
