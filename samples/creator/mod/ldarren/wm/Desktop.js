var
Module = require('Module'),
specMgr = require('specMgr'),
tpl = '<div class=dir></div>',
baseZ = 10000

exports.Class = Module.Class.extend({
    id: 'ldwmDesktop',
    signals: ['open', 'close', 'focus', 'blur', 'mousemove', 'mouseup'],
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
    events: {
        'mousemove': function(e){
            this.signals.mousemove(e).send([this.host])
        },
        'mouseup': function(e){
            this.signals.mouseup(e).send([this.host])
        }
    },
    slots:{
        open: function(sender, fileId){
            var
            currZ = baseZ + this.windows.length + 1,
            win = this.spawn(this.deps.Window, null, [
                    specMgr.create('title', 'text', fileId),
                    specMgr.create('z', 'number', currZ--)
                ])
            for(var z, i=this.windows.length; i--;) {
                this.signals.blur(currZ--).send(this.windows[i])
            }
            this.windows.push(win)
            this.active = win
            this.signals.open().send(win)
        },
        opened: function(sender){
        },
        closed: function(sender){
            sender.remove()
        },
        focus: function(sender){
            var currZ = baseZ + this.windows.length

            if (this.active === sender) return

            // Reorder windows stack (@todo optimize this)
            this.windows.splice(this.windows.indexOf(sender), 1) // Remove from array
            this.windows.push(sender)

            this.signals.focus(currZ--).send(sender)

            for(var z, i=this.windows.length-1; i--;) {
                this.signals.blur(currZ--).send(this.windows[i])
            }

            this.active = sender
        },
        blurred: function(sender){
            if (this.active === sender) this.active = null
        }
    }
})
