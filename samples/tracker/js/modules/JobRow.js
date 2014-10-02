var
Module = require('Module'),
tpl = require('@html/ListRow.html'),
common = require('modules/common')

exports.Class = Module.Class.extend({
    tagName: 'li',
    className: 'table-view-cell',
    create: function(spec){
        this.model = this.requireType('model').value
        this.edit = this.require('edit').value

        this.listenTo(this.model, 'change', this.render)
    },
    render: function(){
        var
        m = this.model.attributes,
        info = m.json
        this.$el.html(_.template(tpl.text, {
            url: '#job/' +(this.edit ? 'edit/':'')+ m.id,
            title: info.pickup + ' -> ' + info.dropoff,
            desc: info.date + ' ' + info.time
        }))
        return this.el
    }
})
