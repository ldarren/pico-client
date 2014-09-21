var
Module = require('Module'),
tpl = require('@html/ListRow.html')

exports.Class = Module.Class.extend({
    tagName: 'li',
    className: 'table-view-cell',
    create: function(spec){
        this.model = this.requireType('model').value

        this.listenTo(this.model, 'change', this.render)

        this.triggerHost('invalidate')
    },
    render: function(){
        var
        m = this.model,
        type
        switch(m.get('type')){
        case '11': type = 'New User'; break
        case '21': type = 'Customer'; break
        case '31': type = 'Driver'; break
        case '41': type = 'Admin'; break
        case '101': type = 'Super Admin'; break
        default: type = 'Invalid'; break
        }
        this.$el.html(_.template(tpl.text, {
            url: 'users/' + m.id,
            title: m.get('name'),
            desc: type
        }))
        return this.el
    }
})
