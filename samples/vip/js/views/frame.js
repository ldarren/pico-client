var
PageSlider = require('pageslider'),
Home = require('views/home'),
Shop = require('views/shop'),
spawnPoint = window.history.length,
collection, router, slider,
topBar, backBtn, title, searchBtn;

me.Class = Backbone.View.extend({
    el: 'body',

    initialize: function(options){
        var self = this;
        collection = options.collection;
        router = options.router;
        pico.embed(this.el, 'html/frame.html', function(){
            self.render();
        });
    },

    render: function(){
        slider = new PageSlider.Class(this.$el);

        topBar = this.$('header.bar');
        backBtn = this.$('header .pull-left');
        title = this.$('header h1.title');
        searchBtn = this.$('header .pull-right');
        
        router.on('route', this.changePage);

        // Start Backbone history a necessary step for bookmarkable URL's
        Backbone.history.start();
    },

    changePage: function(route, params){
        var page;
        backBtn.removeClass('hidden');

        switch(route){
        case 'shop':
            var model = collection.get(params[0]);
            page = new Shop.Class({model: model});
            title.contents().first().text(model.get('name'));
            break;
        default:
            page = new Home.Class(collection); 
            backBtn.addClass('hidden');
            title.contents().first().text('VIP');
            break;
        }
        slider.slidePage(page.render().$el);
    },

    events: {
        'click header .pull-left': 'back'
    },

    back: function(e){
        if (window.history.length > spawnPoint){
            window.history.back();
        }else{
            router.navigate('', {trigger: true});
        }
    }
});
