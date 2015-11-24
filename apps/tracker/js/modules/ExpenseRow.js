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

        this.listenTo(this.model, 'change', this.render)
    },
    render: function(){
        var
        m = this.model.attributes,
        info = m.json
        this.$el.html(_.template(tpl.text, {
            url: '#expense/' +this.month+'/'+ m.id,
            title: this.month+'-'+String('0'+(m.id+1)).slice(-2),
            desc: 'Total $'+m.value
        }))
        return this.el
    }
})
