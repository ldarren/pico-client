pico.start({
    name: 'VIP',
    production: false,
    paths:{
        '*': 'js/',
        pico: 'lib/pico/lib/',
        ratchet: 'lib/ratchet-v2.0.2/js/ratchet',
        zepto: 'lib/zepto-1.1.3.min',
        lodash: 'lib/lodash.mobile-2.4.1.min',
        backbone: 'lib/backbone-1.1.2.min'
    }
},function(){
    require('ratchet');
    require('zepto');
    require('lodash');
    require('backbone');

    require('route');
});
