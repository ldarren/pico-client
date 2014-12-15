pico.start({
    name: 'main',
    production: false,
    paths:{
        '*': 'js/',
        root: './',
        html: 'html/',
        mod: 'mod/',
        ld: 'mod/ldarren/',
        pico: 'lib/pico/lib/'
    }
},function(){
    require('Module') //preload
    var
    network = require('network'),
    specMgr = require('specMgr'),
    Frame = require('Frame'),
    project = require('@root/project.json')

    me.slot(pico.LOAD, function(){
        var json = project.json
        network.create(specMgr.findAll('channel', json.spec), function(err){
            if (err) return console.error(err)
            new Frame.Class(json)
        })
    })
})
