exports.instance = new (Backbone.Router.extend({
    routes: {
        'project/:id': 'project',
        'widget/:id': 'widget',
        '*actions': 'home'
    }
}))
