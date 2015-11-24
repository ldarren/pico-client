var
Module = require('Module'),
tpl = require('@html/ListRow.html'),
common = require('modules/common')

exports.Class = Module.Class.extend({
    tagName: 'li',
    className: 'table-view-cell',
    create: function(spec){
        this.model = this.requireType('model').value
        this.href = this.require('href').value

        this.el.setAttribute('userData', this.model.id)

        this.listenTo(this.model, 'change', this.render)
    },
    render: function(){
        var m = this.model
        this.$el.html(_.template(tpl.text, {
            url: this.href ? this.href + m.id : 'javascript:void(0)',
            title: m.get('json').name,
            desc: common.roleDesc(m.get('user'))
        }))
        return this.el
    }
})
