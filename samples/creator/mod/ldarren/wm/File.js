var
Module = require('Module'),
tpl = '<div class=icon></div><div class=name></div>'

exports.Class = Module.Class.extend({
    className: 'file',
    signals: [],
    requires:{
        'file':'file'
    },
    create: function(requires, params){
        var file = requires.file.value
        this.el.innerHTML = tpl
        this.$('.icon').addClass('icon-'+file.icon)
        this.$('.name').text(file.name)
    },
    slots:{
    }
})
