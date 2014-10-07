var
Module = require('Module'),
common = require('modules/common'),
tpl = '#<%=id%><div class=right>$<%=info.charge%></div>'+
    '<div><%=info.time%></div>'+
    '<div class=pickup><%=info.pickup%></div><div class=dropoff><%=info.dropoff%></div>'

exports.Class = Module.Class.extend({
    tagName: 'li',
    className: 'table-view-cell',
    create: function(spec){
        var m = this.requireType('model').value.attributes
        this.$el.html(_.template(tpl, {id:m.id, info:m.json}))
    }
})
