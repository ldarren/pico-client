pico.start({
    name: 'PROJ_ID',
    production: false,
    host: __,
    paths:{
        '*': 'js/',
        root: './',
        json: 'json/',
        mod: 'mod/',
        pico: 'lib/pico/lib/'
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
