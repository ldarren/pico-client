pico.start({
    name: 'main',
    production: false,
    paths:{
        '*': 'js/',
        root: './',
        json: 'json/',
        html: 'html/',
        mod: 'mod/',
        ld: 'mod/ldarren/',
        pico: 'lib/pico/lib/'
    }
},function(){
    require('Module') //preload
    var
    Frame = require('Frame'),
    project = require('@root/project.json')

    me.slot(pico.LOAD, function(){
        new Frame.Class(project.json)
    })
})
