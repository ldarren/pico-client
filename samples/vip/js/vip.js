pico.start({
    name: 'VIP',
    production: false,
    paths:{
        '*': 'js/',
        views: 'js/views',
        models: 'js/models',
        pico: 'lib/pico/lib/',
        ratchet: 'lib/ratchet-v2.0.2/js/ratchet',
        pageslider: 'lib/pageslider/pageslider',
        zepto: 'lib/zepto-1.1.3.min',
        lodash: 'lib/lodash.mobile-2.4.1.min',
        backbone: 'lib/backbone-1.1.2.min'
    }
},function(){
    require('ratchet');
    require('pageslider');
    require('zepto');
    require('lodash');
    require('backbone');

    require('route');
    require('views/frame');

    // Start Backbone history a necessary step for bookmarkable URL's
    Backbone.history.start();
});
