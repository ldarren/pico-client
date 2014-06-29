pico.start({
    name: 'Tracker',
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
    require('zepto')
    require('ratchet')
    require('lodash')
    require('backbone')

    var
    network = require('network'),
    ModelUser = require('models/User'),
    ModelDefaults = require('models/Defaults'),
    ViewFrame = require('views/Frame'),
    user, defaults, frame;

    me.slot(pico.LOAD, function(){
        network.onConnected(function(){
            user = new ModelUser.Class();
            user.fetch({
                url: 'vip/user/read',
                success: function(){
                    defaults = new ModelDefaults.Class()
                    defaults.fetch({
                        url: 'tracker/defaults/read',
                        success: function(){
                            frame = new ViewFrame.Class({
                                user: user,
                                defaults: defaults
                            })
                        }
                    })
                },
                error: function(){
                    debugger;
                }
            })
        })
    })
})
