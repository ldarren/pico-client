pico.run({
    name: 'main',
    production: false,
    ajax: __.ajax,
    onLoad: __.onLoad,
    paths:{
        '*': 'mod/',
        root: './',
        cfg: 'cfg/',
        js: 'js/',
        json: 'json/',
        pico: 'lib/pico/lib/',
        ld: 'mod/ldarren/'
    }
},function(){
    require('js/Module') //preload
    var
    Frame = require('js/Frame'),
    project = require('cfg/project.json'),
    env = require('cfg/env.json')

    this.load=function(){
        new Frame(project, env)
    }
})
