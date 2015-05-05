pico.start({
    name: 'PROJ_ID',
    production: false,
    paths:{
        '*': 'core/',
        html: 'html/',
        js: 'js/',
        lib: 'lib/',
        cfg: 'cfg/',
        pico: 'lib/pico/lib/'
    }
},function(){
    require('Module') // preload
    var
    env = require('cfg/env'),
    project = require('cfg/project'),
    network = require('network'),
    Frame = require('Frame')

    me.slot(pico.LOAD, function(){
        network.create(env.config.channels, function(err){
            if (err) return console.error(err)
            new Frame.Class(project.config)
        })
    })
})
