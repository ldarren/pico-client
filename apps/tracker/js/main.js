pico.start({
    name: 'tracker',
    production: false,
    paths:{
        '*': 'js/',
        root: './',
        html: 'html/',
        modules: 'js/modules/',
        pico: 'lib/pico/lib/'
    }
},function(){
    require('Module') // preload
    var
    Frame = require('Frame'),
    project = require('@root/project.json')

    me.slot(pico.LOAD, function(){
        new Frame.Class(project.json)
    })
})
