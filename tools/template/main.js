pico.start({
    name: 'PROJ_NAME',
    production: false,
    paths:{
        '*': 'js/',
        html: 'html/',
        modules: 'js/modules/',
        pico: 'lib/pico/lib/',
        pageslider: 'lib/pageslider/pageslider',
    }
},function(){
    require('Module')//preload
    var
    network = require('network'),
    spec = require('spec'),
    Frame = require('Frame')

    me.slot(pico.LOAD, function(){
        network.slot('connected', function(project){
            network.create(spec.find('projURL', project.spec).value, true, function(err){
                if (err) return console.error(err)
                new Frame.Class({project: project})
            })
        })
    })
})
