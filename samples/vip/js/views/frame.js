var
PageSlider = require('pageslider'),
Home = require('views/home'),
Shop = require('views/shop'),
appName = 'Kards',
spawnPoint = window.history.length,
collection, router, slider,
topBar, search, backBtn, title, searchBtn,
restoreHeader = function(){
    if (title.contents().first().text() === appName){
        backBtn.addClass('hidden');
    }else{
        backBtn.removeClass('hidden');
    }
    title.removeClass('hidden');
    searchBtn.removeClass('hidden');
    search.addClass('hidden');
};

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

        var popover = this.$('#popOptions ul.table-view');
        popover.append($('<li class="table-view-cell">Settings</li>'));

        topBar = this.$('header.bar');
        search = this.$('input[type=search]', topBar);
        backBtn = this.$('.pull-left', topBar);
        title = this.$('h1.title', topBar);
        searchBtn = this.$('.pull-right', topBar);
        
        router.on('route', this.changePage);

        // Start Backbone history a necessary step for bookmarkable URL's
        Backbone.history.start();
    },

    changePage: function(route, params){
        var page;

        switch(route){
        case 'newShop':
            page = new NewShop.Class();
            title.contents().first().text('New Shop');
            break;
        case 'shop':
            var model = collection.get(params[0]);
            page = new Shop.Class({model: model});
            title.contents().first().text(model.get('name'));
            break;
        default:
            page = new Home.Class(collection); 
            title.contents().first().text(appName);
            break;
        }

        restoreHeader();
        slider.slidePage(page.render().$el);
    },

    events: {
        'click header .pull-left': 'back',
        'click header .pull-right': 'showFind',
        'keydown header input[type=search]': 'find'
    },

    back: function(e){
        if (window.history.length > spawnPoint){
            window.history.back();
        }else{
            router.navigate('', {trigger: true});
        }
    },

    showFind: function(e){
        backBtn.addClass('hidden');
        title.addClass('hidden');
        searchBtn.addClass('hidden');
        search.removeClass('hidden').focus();
    },

    find: function(e){
        if (13 !== e.keyCode) return;
        var text = search.val();
        search.val('');
        restoreHeader();
    },
});
