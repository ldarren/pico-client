var
Module = require('Module'),
tpl = require('@html/ListRow.html'),
common = require('modules/common')

exports.Class = Module.Class.extend({
    tagName: 'li',
    className: 'table-view-cell',
    create: function(spec){
        var l = this.require('link').value
        this.$el.html(_.template(tpl.text, {
            url: l,
            title: 'Save invoice as file',
            desc: ''
        }))
    }
})
