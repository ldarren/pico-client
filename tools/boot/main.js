pico.start({
    name: 'PROJECT_NAME',
    production: false,
    paths:{
        '*': 'js/',
        html: 'html/',
        modules: 'js/modules/',
        pico: 'lib/pico/lib/',
        pageslider: 'lib/pageslider/pageslider',
    }
},function(){
    var
    network = require('network'),
    Frame = require('Frame')

    me.slot(pico.LOAD, function(){
        network.slot('connected', function(project){
            new Frame.Class({project: project})
        })
    })
})
