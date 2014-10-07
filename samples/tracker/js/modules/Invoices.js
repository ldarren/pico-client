var
Module = require('Module'),
tpl = require('@html/Edit.html'),
common = require('modules/common')

exports.Class = Module.Class.extend({
    tagName: 'ul',
    className: 'table-view',
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
                    for(var i=0,m; m=raw[i]; i++){
                        self.proxy(Row, [m.id])
                    }
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
