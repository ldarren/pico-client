debugger;
me.route = new (Backbone.Router.extend({
    routes: {
        'shops/:id': 'showShop',
        '*actions': 'defaultRoute' // matches http://example.com/#anything-here
    },
    showShop: function(id){
        PUSH({url:'html/shops.html', transition:'slideIn'});
    },
    defaultRoute: function(actions) {
        PUSH({url:'html/shops.html', transition:'fade'});
    }
}));


// Start Backbone history a necessary step for bookmarkable URL's
Backbone.history.start();
