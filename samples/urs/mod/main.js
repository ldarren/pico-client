pico.start({
    name: 'urs',
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

    me.slot(pico.LOAD, function(){
        new Frame.Class(project.json, env.json)
    })
})
