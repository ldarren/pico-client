var
PageSlider = require('pageslider'),
Home = require('views/home'),
Shop = require('views/shop'),
currHistory = window.history.length,
collections, router, slider, container;

me.Class = Backbone.View.extend({
    el: 'body',

    initialize: function(options){
        var self = this;

        collections = options.collections;
        router = options.router;
        slider = new PageSlider.Class(this.$('.content'));

        router.on('route:home', function(action){
            container = new Home.Class(); 
            self.render();
        });
        router.on('route:shop', function(id){
            container = new Shop.Class({model: collections.get(id)});
            self.render();
        });
        router.on('route', function(route){
            if ('home' === route){
                self.$('header .pull-left').addClass('hidden');
            }else{
                self.$('header .pull-left').removeClass('hidden');
            }
        });
    },

    render: function(){
        slider.slidePage(container.render().$el);
    },

    events: {
        'click header .pull-left': 'back'
    },

    back: function(e){
        if (window.history.length > currHistory){
            window.history.back();
        }else{
            router.navigate('', {trigger: true});
        }
    }
});
