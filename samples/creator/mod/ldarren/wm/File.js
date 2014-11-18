var
Module = require('Module'),
tpl = '<div class=icon></div><div class=name></div>'

exports.Class = Module.Class.extend({
    className: 'file',
    signals: ['open'],
    deps:{
        'file':'file'
    },
    create: function(deps, params){
        var file = deps.file.v
        this.el.innerHTML = tpl
        this.el.setAttribute('fileid', file.id)
        this.$('.icon').addClass('icon-'+file.icon)
        this.$('.name').text(file.name)
    },
    events:{
        click: function(){
            this.signals.open(this.el.getAttribute('fileid')).send(this.host)
        }
    },
    slots:{
    }
})
