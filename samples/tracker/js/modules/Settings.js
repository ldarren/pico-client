var
Module = require('Module'),
tpl = require('@html/Menu.html')

exports.Class = Module.Class.extend({
    className: 'content-padded',
    create: function(spec){
        this.$el.html(_.template(tpl.text, this.require('options')))
    },

    events: {
        'touchstart .signout': 'signout',
        'touchstart .restart': 'restart',
        'touchstart .reload': 'reload'
    },

    signout:function(){
        this.require('owner').value.reset()
    },

    restart: function(){
        window.location.reload(true)
    },

    reload: function(){
        this.triggerHost('refreshCache')
    }
})
