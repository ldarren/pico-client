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

        this.triggerHost('invalidate')
    },
    render: function(){
        var m = this.model
        this.$el.html(_.template(tpl.text, {
            url: '#user/' + m.id,
            title: m.get('json').name,
            desc: common.getRoleDesc(m.get('user')) 
        }))
        return this.el
    }
})
