var router = new (Backbone.Router.extend({
    routes: {
        'shops/:id': 'shop',
        '*actions': 'home' // matches http://example.com/#anything-here
    }
}));

me.get = function(){
    return router;
};
