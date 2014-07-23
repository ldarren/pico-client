pico.start({
    name: 'PROJECT_ID',
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
    Frame = require('Frame')

    me.slot(pico.LOAD, function(){
        network.slot('connected', function(project){
            new Frame.Class({project: project})
        })
    })
})
