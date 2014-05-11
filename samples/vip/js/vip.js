pico.start({
    name: 'VIP',
    paths:{
        '*': 'js/',
        pico: 'lib/pico/lib/',
        ratchet: 'lib/ratchet-v2.0.2/js/ratchet',
        zepto: 'lib/zepto-1.1.3.min',
        lodash: 'lib/lodash.underscore-2.4.1.min',
        underscore: 'lib/underscore-1.6.0.min',
        backbone: 'lib/backbone-1.1.2'
    }
},function(){
    require('ratchet');
    require('zepto');
    require('lodash');
    require('backbone');
});
