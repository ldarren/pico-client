var
Module = require('Module'),
tpl = require('@html/ListRow.html'),
common = require('modules/common')

exports.Class = Module.Class.extend({
    tagName: 'li',
    className: 'table-view-cell',
    create: function(spec){
        var
        m = this.requireType('model').value.attributes,
        info = m.json
        this.$el.html(_.template(tpl.text, {
            url: '#job/' + m.id,
            title: info.pickup + ' -> ' + info.dropoff,
            desc: info.date + ' ' + info.time
        }))
    }
})
