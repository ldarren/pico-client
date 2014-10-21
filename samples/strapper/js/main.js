pico.start({
    name: 'strapper',
    production: false,
    paths:{
        '*': 'js/',
        html: 'html/',
        modules: 'js/modules/',
        pico: 'lib/pico/lib/'
    }
},function(){
    require('Module') // preload
    var
    network = require('network'),
    specMgr = require('specMgr'),
    Frame = require('Frame')

    me.slot(pico.LOAD, function(){
        network.slot('projectLoaded', function(project){
            network.create(specMgr.findAll('channel', project.spec), function(err){
                if (err) return console.error(err)
                new Frame.Class(project)
            })
        })
    })
})
