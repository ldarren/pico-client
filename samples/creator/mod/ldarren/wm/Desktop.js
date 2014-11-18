var
Module = require('Module'),
tpl = '<div class=dir></div>'

exports.Class = Module.Class.extend({
    id: 'ldwmDesktop',
    signals: ['open'],
    deps:{
        apps: 'apps',
        'ld/wm/Window':'Window',
        'ld/wm/MenuBar':'MenuBar',
        'ld/wm/File':'File'
    },
    create: function(deps, params){
        this.el.innerHTML = tpl
        var
        dir = this.$('.dir')[0],
        File = deps.File
        for(var i=0,as=deps.apps.v,a; a=as[i]; i++){
            this.show(this.spawn(File, params, [{i:'file', t:'map', v:a}], true), dir)
        }
    },
    slots:{
        open: function(sender, fileId){
            alert('open: '+fileId)
            this.spawn(this.deps.Window)
        }
    }
})
