pico.start({
    name: 'VIP',
    production: false,
    paths:{
        '*': 'js/',
        views: 'js/views/',
        models: 'js/models/',
        pico: 'lib/pico/lib/',
        ratchet: 'lib/ratchet-v2.0.2/js/ratchet.less',
        pageslider: 'lib/pageslider/pageslider',
        zepto: 'lib/zepto-1.1.3.min',
        lodash: 'lib/lodash.mobile-2.4.1.min',
        backbone: 'lib/backbone-1.1.2.min'
    }
},function(){
    require('ratchet');
    require('zepto');
    require('lodash');
    require('backbone');

    var
    network = require('network'),
    Route = require('Route'),
    ModelUser = require('models/User'),
    ViewFrame = require('views/Frame'),
    user, frame;

    me.slot(pico.LOAD, function(){
        network.onConnected(function(){
            user = new ModelUser.Class();
            user.fetch({
                url: 'vip/user/read',
                success: function(){
                    frame = new ViewFrame.Class({
                        user: user,
                        router: new Route.Class
                    });
                },
                error: function(){
                    debugger;
                }
            });
        });
    });
});
