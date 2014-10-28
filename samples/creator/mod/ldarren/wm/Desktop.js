var
Module = require('Module'),
tpl = '<div class=dir></div>'

exports.Class = Module.Class.extend({
    id: 'ldwmDesktop',
    signals: [],
    requires:{
        apps: 'apps',
        'ld/wm/Window':'Window',
        'ld/wm/MenuBar':'MenuBar',
        'ld/wm/File':'File'
    },
    create: function(requires, params){
        this.el.innerHTML = tpl
        var File = requires.File
        for(var i=0,as=requires.apps.value,a; a=as[i]; i++){
            this.spawn(File, params, {i:'icon', t:'icon', v:a})
        }
    },
    slots:{
        open: function(sender){
        }
    }
})
