me.instance = new (Backbone.Router.extend({
    routes: {
        'report/index': 'report',
        'report/invoice/:start(/:end)': 'invoice',
        'job/list(:filter)': 'jobs',
        'job/create': 'jobNew',
        '*actions': 'home' // matches http://example.com/#anything-here
    },
    links: {
        'job/create': 'New Job',
        '#download': 'Export to xls'
    }
}))
