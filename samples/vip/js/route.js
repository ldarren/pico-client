me.Class = Backbone.Router.extend({
    routes: {
        'user': 'userProfile',
        'shop/create': 'newShop',
        'shop/capture': 'captureShop',
        'shop/:id': 'shop',
        '*actions': 'home' // matches http://example.com/#anything-here
    }
});
