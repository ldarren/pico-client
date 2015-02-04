var
specMgr = require('specMgr'),
mixin = require('ld/wm/mixin'),
tpl = '<div class=dir></div>',
baseZ = 10000

exports.Class = {
    id: 'ldwmDesktop',
    className: 'wm-space',
    signals: ['desktopReady', 'createInstance', 'destroyInstance', 'open', 'close', 'focus', 'blur', 'mousemove', 'mouseup', 'dragleave'],
    deps:{
        apps: 'list',
        'ld/wm/Window':'module',
        'ld/wm/MenuBar':'module',
        'ld/wm/File':'module'
    },
    create: function(deps){
        this.el.innerHTML = tpl
        this.dir = this.el.querySelector('.dir')

        this.windows = []
        this.files = {}
        this.apps = {}
        this.active = null
        this.sayHello() // mixin test

        this.signals.desktopReady().send()
    },
    events: {
        mousemove: function(e){
            this.signals.mousemove(e).send([this.host])
        },
        mouseup: function(e){
            this.signals.mouseup(e).send([this.host])
        },
        dragenter: function(e){
            this.signals.dragleave(e).send([this.host])
        },
        drop: function(e){
            this.signals.dragleave(e).send([this.host])
        }
    },
    slots:{
        open: function(from, sender, fileId){
            var app = this.apps[fileId]
            if (!app) return

            this.signals.createInstance().send(app)
        },
        opened: function(from, sender){
        },
        closed: function(from, sender){
            sender.remove()
            this.signals.destroyInstance(sender.instId).send()
        },
        focus: function(from, sender){
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
        blurred: function(from, sender){
            if (this.active === sender) this.active = null
        },
        appRegister: function(from, sender, fileId, appIcon, appName){
console.log('appRegister: '+fileId)
            this.apps[fileId] = sender
            var file = this.spawn(this.deps['ld/wm/File'], [], [specMgr.create('file', 'map', {id:fileId, icon:appIcon, name:appName})], true)
            this.files[fileId] = file
            this.show(file, this.dir)
        },
        appDeregister: function(from, sender, fileId){
            delete this.apps[fileId]
            var file = this.files[fileId]
            delete this.files[fileId]
            this.dump(file)
        },
        appFocus: function(from, sender, instId){
            var wins = this.windows
            for(var i=0,w; w=wins[i]; i++){
                if (instId === w.instId){
                    this.slots.focus(from, w)
                    return
                }
            }
        },
        appInstance: function(from, sender, content, opts){
            var
            currZ = baseZ + this.windows.length + 1,
            win = this.spawn(this.deps['ld/wm/Window'], null, [
                specMgr.create('instId', 'text', opts.id),
                specMgr.create('title', 'text', opts.name),
                specMgr.create('z', 'number', currZ--),
                specMgr.create('content', 'dom', content),
                specMgr.create('width', 'number', opts.width),
                specMgr.create('height', 'number', opts.height)
            ])

            for(var z, i=this.windows.length; i--;) {
                this.signals.blur(currZ--).send(this.windows[i])
            }
            this.windows.push(win)
            this.active = win
            this.signals.open().send(win)
        }
    }
}

// mixin test
exports.Mixin = function(spec){
    return [mixin.test]
}
