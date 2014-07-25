pico.start({
    name: 'Studio',
    production: false,
    paths:{
        '*': 'js/',
        views: 'js/views/',
        html: 'html/',
        models: 'js/models/',
        pico: 'lib/pico/lib/',
    }
},function(){
    require('views/Panel')

    var
    network = require('network'),
    ViewFrame = require('views/Frame')

    exports.slot(pico.LOAD, function(){
        network.slot('connected', function(){
            new ViewFrame.Class
        })
    })
})
