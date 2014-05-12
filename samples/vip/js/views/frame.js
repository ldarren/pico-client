var
Router = require('router'),
Slider = require('pageslider'),
Home = require('views/home'),
Shop = require('views/shop');

var frame = new (Backbone.View.extend({
    el: 'body',
    initialize: function(){
        var self = this;
        this.slider = Slider.create(this.$('.container'));
        var router = Router.get();
        router.on('route:home', function(){
            self.container = Home.create();
            self.render();
        });
    },
    render: function(){

    }
}));
