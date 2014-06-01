var
PageSlider = require('pageslider'),
Home = require('views/home'),
Shop = require('views/shop'),
NewShop = require('views/newShop'),
UserProfile = require('views/user'),
ModelShops = require('models/shops'),
OPTION_TPL = '<li id=KEY class=table-view-cell>VALUE</li>',
spawnPoint = window.history.length,
user, collection, router, slider, page, popover,
topBar, search, leftBtn, titleOptions, title, rightBtn,
drawHeader = function(bar){
    if (!bar){
        title.addClass('hidden');
        titleOptions.addClass('hidden');
        leftBtn.addClass('hidden');
        rightBtn.addClass('hidden');
        search.removeClass('hidden').focus();
        return;
    }
    search.addClass('hidden').blur();
    var optionKeys = Object.keys(bar.options || {});
    if (optionKeys.length){
        titleOptions.contents().first().text(bar.title);
        title.addClass('hidden');
        titleOptions.removeClass('hidden');
        popover.empty();
        _.each(bar.options, function(value, key){
            popover.append($(OPTION_TPL.replace('KEY', key).replace('VALUE', value)));
        });
    }else{
        title.text(bar.title);
        title.removeClass('hidden');
        titleOptions.addClass('hidden');
    }
    if (bar.left){
        leftBtn.attr('id', bar.left);
        leftBtn.removeClass('hidden');
        leftBtn.removeClass (function (index, css) {
            return (css.match (/(^|\s)icon-\S+/g) || []).join(' ');
        });
        leftBtn.addClass('icon-'+bar.left);
    }else{
        leftBtn.addClass('hidden');
    }
    if (bar.right){
        rightBtn.attr('id', bar.right);
        rightBtn.removeClass('hidden');
        rightBtn.removeClass (function (index, css) {
            return (css.match (/(^|\s)icon-\S+/g) || []).join(' ');
        });
        rightBtn.addClass('icon-'+bar.right);
    }else{
        rightBtn.addClass('hidden');
    }
},
back = function(e){
    if (window.history.length > spawnPoint){
        window.history.back();
    }else{
        router.navigate('', {trigger: true});
    }
};

me.Class = Backbone.View.extend({
    el: 'body',

    initialize: function(options){
        var me = this;
        user = options.user;
        router = options.router;
        collection = new ModelShops.Class();
        collection.fetch({
            url: 'vip/shops/get',
            data:{
                list: user.follows
            },
            success: function(){
                pico.embed(this.el, 'html/frame.html', function(){
                    slider = new PageSlider.Class(me.$el);

                    popover = me.$('#popOptions ul.table-view');

                    topBar = me.$('header.bar');
                    search = topBar.find('input[type=search]');
                    leftBtn = topBar.find('.pull-left');
                    titleOptions = topBar.find('h1#options.title');
                    title = topBar.find('h1#simple.title');
                    rightBtn = topBar.find('.pull-right');
                    
                    router.on('route', me.changePage, me);

                    // Start Backbone history a necessary step for bookmarkable URL's
                    Backbone.history.start();
                });
            },
            error: function(){
                debugger;
            }
        });
    },

    render: function(){
        drawHeader(page.getHeader());
        slider.slidePage(page.render().$el);
    },

    changePage: function(route, params){
        switch(route){
        case 'userProfile':
            page = new UserProfile.Class();
            break;
        case 'newShop':
            page = new NewShop.Class();
            break;
        case 'shop':
            var model = collection.get(params[0]);
            page = new Shop.Class({model: model});
            break;
        default:
            page = new Home.Class(collection);
            break;
        }

        this.render();
    },

    events: {
        'touchstart header .pull-left': 'onLeftBtn',
        'touchstart header .pull-right': 'onRightBtn',
        'touchstart #popOptions li': function(e){
            router.navigate(e.srcElement.id, {trigger:true})
        },
        'keyup header input[type=search]': 'find'
    },

    onLeftBtn: function(e){
        var id = e.srcElement.id;
        switch(id){
        case 'left-nav':
            back();
            break;
        default:
            page.$el.trigger(id);
        }
    },

    onRightBtn: function(e){
        var id = e.srcElement.id;
        switch(id){
        case 'search':
            drawHeader();
            break;
        default:
            page.$el.trigger(id);
        }
    },

    find: function(e){
        page.$el.trigger('find', [search.val()]);
        if (13 === e.keyCode){
            search.val('');
            drawHeader(page.getHeader());
        }
    },
});
