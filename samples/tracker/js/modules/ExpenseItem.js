var
Module = require('Module'),
tpl = require('@html/ListRow.html'),
common = require('modules/common')

exports.Class = Module.Class.extend({
    tagName: 'li',
    className: 'table-view-cell',
    create: function(spec){
        this.model = this.requireType('model').value
        this.month = this.require('month').value
        this.date = this.require('date').value

        this.listenTo(this.model, 'change', this.render)
    },
    render: function(){
        var
        m = this.model.attributes,
        info = m.json
        this.$el.html(_.template(tpl.text, {
            url: '#expense/edit/' +this.month+'/'+this.date+'/'+ m.id,
            title: m.desc,
            desc: '$'+m.value
        }))
        return this.el
    }
})
