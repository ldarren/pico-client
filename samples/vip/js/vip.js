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
    var network = require('network');

    var
    Route = require('route'),
    ModelUser = require('models/user'),
    ViewFrame = require('views/frame'),
    user, frame;

    me.slot(pico.LOAD, function(){
        $.fn.serializeObject = function() {
            var o = {}, k; 
            $.each(this.serializeArray(), function() {
                k = this.name;
                if (!k) return;
                if (undefined === o[k]) {
                    o[k] = this.value || '';
                } else {
                    if (!o[k].push) o[k] = [o[k]];
                    o[k].push(this.value || '');
                }
            });
            return o;
        };
        network.onConnected(function(){
            user = new ModelUser.Class();
            user.fetch({
                url: 'vip/user/get',
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
/*
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
*/
