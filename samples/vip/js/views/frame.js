var
PageSlider = require('pageslider'),
Home = require('views/home'),
Shop = require('views/shop'),
NewShop = require('views/newShop'),
UserProfile = require('views/user'),
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
    console.log(Backbone.history.fragment, router[Backbone.history.fragment]);
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
        popover.append($('<li class="table-view-cell">User Profile</li>'));

        topBar = this.$('header.bar');
        search = topBar.find('input[type=search]');
        backBtn = topBar.find('.pull-left');
        title = topBar.find('h1.title');
        searchBtn = topBar.find('.pull-right');
        
        router.on('route', this.changePage);

        // Start Backbone history a necessary step for bookmarkable URL's
        Backbone.history.start();
    },

    changePage: function(route, params){
        var page;

        switch(route){
        case 'userProfile':
            page = new UserProfile.Class();
            title.contents().first().text('User Profile');
            break;
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
        'touchstart header .pull-left': 'back',
        'touchstart header .pull-right': 'showFind',
        'touchstart #popOptions li:nth-child(1)': function(e){
            router.navigate('user', {trigger:true})
        },
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
