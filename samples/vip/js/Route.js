me.Class = Backbone.Router.extend({
    routes: {
        'user': 'profile',
        'company/create': 'startup',
        'company/:id': 'company',
        '*actions': 'home' // matches http://example.com/#anything-here
    }
});
