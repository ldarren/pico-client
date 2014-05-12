var Router = require('router'),

var frame = new (Backbone.View.extend({
    el: 'body',
    initialize: function(){
        this.slider = Slider.create(this.$('.container'));
        var router = Router.get();
        router.on('route', function(){
            debugger;
        });
    },
}));
