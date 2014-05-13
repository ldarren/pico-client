me.Class = Backbone.Router.extend({
    routes: {
        'shop/:id': 'shop',
        '*actions': 'home' // matches http://example.com/#anything-here
    }
});
