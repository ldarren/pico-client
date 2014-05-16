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
    require('pageslider');
    require('zepto');
    require('lodash');
    require('backbone');
    require('network');

    var
    Route = require('route'),
    ModelShop = require('models/shop'),
    ModelShops = require('models/shops'),
    ViewFrame = require('views/frame'),
    frame;

    me.slot(pico.LOAD, function(){
        // Start Backbone history a necessary step for bookmarkable URL's
        var shopList = [];
        shopList.push(new ModelShop.Class({
            id: 1,
            img: "http://dungeon-chronicles.com/pageslider/images/buildbot.jpg",
            name: "Build Bot",
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
        }));
        shopList.push(new ModelShop.Class({
            id: 2,
            img: "http://dungeon-chronicles.com/pageslider/images/medibot.jpg",
            name: "Medic Bot",
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
        }));
        shopList.push(new ModelShop.Class({
            id: 3,
            img: "http://dungeon-chronicles.com/pageslider/images/ripplebot.jpg",
            name: "Ripple Bot",
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
        }));
        var shops = new ModelShops.Class(shopList);

        shops.fetch({
            url: 'vip/shop/list',
            success: function(){
                debugger;
            },
            error: function(){
                debugger;
            }
        });
        frame = new ViewFrame.Class({
            collections: shops,
            router: new Route.Class
        });
        Backbone.history.start();
    });
});
