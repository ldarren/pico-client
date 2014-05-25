me.Class = Backbone.Router.extend({
    routes: {
        'shop/create': 'newShop',
        'shop/:id': 'shop',
        '*actions': 'home' // matches http://example.com/#anything-here
    }
});
