var
Module = require('Module'),
specMgr = require('specMgr'),
tpl = '<div class=dir></div>'

exports.Class = Module.Class.extend({
    id: 'ldwmDesktop',
    signals: ['open', 'close', 'focus', 'blur'],
    deps:{
        apps: 'apps',
        'ld/wm/Window':'Window',
        'ld/wm/MenuBar':'MenuBar',
        'ld/wm/File':'File'
    },
    className: 'wm-space',
    create: function(deps, params){
        this.el.innerHTML = tpl
        var
        dir = this.el.querySelector('.dir'),
        File = deps.File

        for(var i=0,as=deps.apps.v,a; a=as[i]; i++){
            this.show(this.spawn(File, params, [specMgr.create('file', 'map', a)], true), dir)
        }

        this.windows = []
        this.active = null
    },
    slots:{
        open: function(sender, fileId){
            var win = this.spawn(this.deps.Window, null, [specMgr.create('title', 'text', fileId)])
            this.windows.push(win)
            this.active = win
            this.signals.open().send(win)
        },
        close: function(sender, fileId){
        },
        focus: function(sender, fileId){
        },
        blur: function(sender, fileId){
        },
        toggle: function(sender, fileId){
        },
        closed: function(sender){
            sender.remove()
        }
    }
})
