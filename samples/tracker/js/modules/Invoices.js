var
Module = require('Module'),
common = require('modules/common'),
dateTpl = '<div class=card><ul class=table-view><li class="table-view-cell table-view-divider">DATE</li></ul></div>',
transactTpl = '<li class=table-view-cell>#<%=id%><div class=right>$<%=info.charge||0%></div>'+
    '<div><%=info.time%></div>'+
    '<div class=pickup><%=info.pickup%></div><div class=dropoff><%=info.dropoff%></div></li>',
totalTpl = 
'<div class=card><ul class=table-view>'+
'<li class="table-view-cell table-view-divider">Summary</li>'+
'<li class=table-view-cell>Grand total<div class=right>$TOTAL</div></li>'+
'<li class=table-view-cell>Deposit<div class=right>$DEPOSIT</div></li>'+
'<li class=table-view-cell>Total Due<div class=right>$DUE</div></li>'+
'</ul></div>'

exports.Class = Module.Class.extend({
    create: function(spec, params){
        var
        self = this,
        type = params[0],
        Row = this.require('InvoiceRow'),
        Link = this.require('InvoiceLink'),
        link = this.require('link')
        this.require('invoice').value.fetch({
            data:{
                type: type,
                from: params[1],
                to: params[2]
            },
            success: function(coll, raw){
                switch(type){
                case '1':
                    var
                    $el = self.$el,
                    currDate, date, $ul, total=0,json
                    for(var i=0,m; m=raw[i]; i++){
                        json = m.json
                        date = json.date
                        if (currDate !== date){
                            $el.append(dateTpl.replace('DATE', (new Date(date)).toLocaleDateString()))
                            $ul = $el.find('ul').eq(-1)
                            currDate = date
                        }
                        total += parseInt(json.charge) || 0
                        $ul.append(_.template(transactTpl, {id:m.id, info:json}))
                    }
                    $el.append(totalTpl.replace('TOTAL', total).replace('DEPOSIT', 0).replace('DUE', total))
                    break
                default:
                    link.value = raw
                    self.proxy(Link)
                    break
                }
            }
        })
    }
})
