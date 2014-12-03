var
Module = require('Module'),
Router = require('Router'),
common = require('modules/common'),
daysInMonth = function(month, year){ return new Date(year, month+1, 0).getDate() },
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
        expense = data.findWhere({month:month}),
        date = expense ? expense.get('date').split(',') : [],
        expenseId = expense ? expense.id : 0,
        then = new Date(month)

        this.Row = this.require('ExpenseRow')

        this.listenTo(expenses, 'add', addRow)

        for(var i=1,l=daysInMonth(then.getMonth(), then.getFullYear())+1; i<l; i++){
            expenses.add({id:i, label:then.getDate(), value:date[i] || 0, expenseId:expenseId})
        }
    }
})
