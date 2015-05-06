pico.start({
    name: 'main',
    production: false,
    host: __,
    paths:{
        '*': 'js/',
        root: './',
        json: 'json/',
        mod: 'mod/',
        pico: 'lib/pico/lib/',
        ld: 'mod/ldarren/'
    }
},function(){
    require('Module') //preload
    var
    Frame = require('Frame'),
    project = require('@root/project.json'),
    env = require('@root/env.json')

    me.slot(pico.LOAD, function(){
        new Frame.Class(project.json, env.json)
    })
})
