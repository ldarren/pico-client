var
Module = require('Module'),
tpl = require('@html/ListRow.html'),
common = require('modules/common')

exports.Class = Module.Class.extend({
    tagName: 'li',
    className: 'table-view-cell',
    create: function(spec){
        this.model = this.requireType('model').value

        this.listenTo(this.model, 'change', this.render)
    },
    render: function(){
        var
        m = this.model,
        info = m.get('json')
        this.$el.html(_.template(tpl.text, {
            url: '#vehicle/' + m.id,
            title: info.tag,
            desc: 'Seater:'+info.seater+' model:'+info.model
        }))
        return this.el
    }
})
