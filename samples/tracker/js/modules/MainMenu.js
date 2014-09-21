var
Module = require('Module'),
tpl = require('@html/MainMenu.html')

exports.Class = Module.Class.extend({
    className: 'card',
    create: function(spec){
        this.$el.html(_.template(tpl.text, this.require('menu')))
        this.triggerHost('invalidate')
    }
})
