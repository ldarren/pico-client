var
Module = require('Module'),
common = require('modules/common'),
pnlTpl =
'<div class=card><ul class=table-view>'+
'<li class="table-view-cell table-view-divider"><%=date%></li>'+
'<li class=table-view-cell>Income $<%=income%></li>'+
'<li class=table-view-cell>Expenses $<%=expenses%></li>'+
'<li class=table-view-cell>Profit<div class=right>$<%=profit%></div></li>'+
'</ul></div>',
totalTpl = 
'<div class=card><ul class=table-view>'+
'<li class="table-view-cell table-view-divider">Total</li>'+
'<li class=table-view-cell>Total Income<div class=right>$<%=income%></div></li>'+
'<li class=table-view-cell>Total Expenses<div class=right>$<%=expenses%></div></li>'+
'<li class=table-view-cell>Total Profit<div class=right>$<%=profit%></div></li>'+
'</ul></div>'

exports.Class = Module.Class.extend({
    create: function(spec, params){
        var self = this

        this.require('invoice').value.fetch({
            data:{
                type: 3,
                from: params[0],
                to: params[1]
            },
            success: function(coll, raw){
                var
                $el = self.$el,
                month = params[0].substr(0, 7),
                income = raw.income,
                expenses = raw.expenses,
                totalIncome=0, totalExpenses=0

                for(var i=0,l=expenses.length,ex,ic; i<l; i++){
                    ex=expenses[i]
                    ic=income[i]
                    totalIncome += ic
                    totalExpenses += ex
                    $el.append(_.template(pnlTpl, {
                        date: month+'-'+('0'+(i+1)).slice(-2),
                        income: ic,
                        expenses: ex,
                        profit: totalIncome - totalExpenses
                    }))
                }
                $el.append(_.template(totalTpl, {
                    income: totalIncome,
                    expenses: totalExpenses,
                    profit: totalIncome - totalExpenses
                }))
            }
        })
    }
})
