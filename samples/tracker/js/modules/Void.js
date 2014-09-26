var
Module = require('Module'),
tpl = require('@html/Void.html')

exports.Class = Module.Class.extend({
    className: 'voidPage',
    create: function(spec){
        var info = this.require('info').value
        this.$el.html(_.template(tpl.text, info))
    }
})
