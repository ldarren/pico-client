pico.start({
    name: 'PROJ_ID',
    production: false,
    ajax: __.ajax,
    onLoad: __.onLoad,
    paths:{
        '*': 'js/',
        root: './',
        json: 'json/',
        mod: 'mod/',
        pico: 'lib/pico/lib/',
    }
},function(){
    require('Module') //preload
    var
    Frame = require('Frame'),
    project = require('@mod/project.json'),
    env = require('@mod/env.json')

    return function(){
        new Frame(project.json, env.json)
    }
})
