pico.run({
    name: 'PROJ_ID',
    ajax: __.ajax,
    onLoad: __.onLoad,
    env:{
        live:false
    },
    preprocessors:{
        '.asp':function(url,txt){ return _.template(txt) }
    },
    paths:{
        '*': 'mod/',
        root: './',
        cfg: 'cfg/',
        js: 'js/',
        json: 'json/'
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
