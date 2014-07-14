pico.start({
    name: 'PROJECT_NAME',
    production: false,
    paths:{
        '*': 'js/',
        views: 'js/views/',
        html: 'html/',
        models: 'js/models/',
        pico: 'lib/pico/lib/',
    }
},function(){
    var
    network = require('network'),
    ViewFrame = require('views/Frame')

    me.slot(pico.LOAD, function(){
        network.slot('connected', function(project){
            new ViewFrame.Class({project: project})
        })
    })
})
