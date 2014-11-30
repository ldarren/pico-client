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
        date = new Date(this.require('month').value)

        this.Row = this.require('ExpenseRow')

        this.listenTo(expenses, 'add', addRow)

        for(var i=1,l=daysInMonth(date.getMonth(), date.getFullYear())+1; i<l; i++){
            expenses.add({id:i, label:date.getDate(), value:0})
        }
    }
})
