var
Router = require('router'),
PageSlider = require('pageslider'),
Home = require('views/home'),
Shop = require('views/shop'),
slider, container;

var frame = new (Backbone.View.extend({
    el: 'body',
    initialize: function(){
        var self = this;
        slider = PageSlider.create(this.$('.content'));
        var router = Router.get();
        router.on('route:home', function(action){
            container = Home.create();
            self.render();
        });
        router.on('route:shop', function(id){
            container = Shop.create(id);
            self.render();
        });
    },
    render: function(){
        slider.slidePage(container.render().$el);
    }
}));
