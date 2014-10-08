var
Module = require('Module'),
common = require('modules/common'),
dateTpl = '<div class=card><ul class=table-view><li class="table-view-cell table-view-divider">DATE</li></ul></div>',
transactTpl =
'<li class=table-view-cell>#<%=id%><div class=right>$<%=info.charge||0%></div>'+
'<div><%=info.time%></div>'+
'<div class=pickup><%=info.pickup%></div><div class=dropoff><%=info.dropoff%></div></li>',
totalTpl = 
'<div class=card><ul class=table-view>'+
'<li class="table-view-cell table-view-divider">Summary</li>'+
'<li class=table-view-cell>Grand total<div class=right>$TOTAL</div></li>'+
'<li class=table-view-cell>Deposit<div class=right>$DEPOSIT</div></li>'+
'<li class=table-view-cell>Total Due<div class=right>$DUE</div></li>'+
'</ul></div>',
linkTpl =
'<div class=card><ul class=table-view>'+
'<li class="table-view-cell media"><a class="navigate-right" href=URL><span class="media-object pull-left icon icon-ICON"></span>'+
'<div class="media-body">TITLE<p>DESC</p></div></a></li>'+
'</ul></div>'

exports.Class = Module.Class.extend({
    create: function(spec, params){
        var
        self = this,
        type = params[0]
        this.require('invoice').value.fetch({
            data:{
                type: type,
                from: params[1],
                to: params[2]
            },
            success: function(coll, raw){
                var $el = self.$el
                switch(type){
                case '1':
                    var currDate, date, $ul, total=0,json
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
                case '2':
                    $el.append(linkTpl.replace('URL', raw).replace('ICON', 'file-word').replace('TITLE', 'Download invoice').replace('DESC', 'Save as word document'))
                    break
                case '3':
                    $el.append(linkTpl.replace('URL', raw).replace('ICON', 'file-excel').replace('TITLE', 'Download report').replace('DESC', 'Save as excel spreadsheet'))
                    break
                }
            }
        })
    }
})
