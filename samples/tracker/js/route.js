me.instance = new (Backbone.Router.extend({
    routes: {
        'report/index': 'report',
        'report/invoice/:start(/:end)': 'invoice',
        'report/invoice/download/:start(/:end)': 'download',
        'job/list(/:filter)': 'jobs',
        'job/details/:id': 'job',
        'job/create': 'jobNew',
        '*actions': 'home' // matches http://example.com/#anything-here
    },
    links: {
        'job/create': 'New Job',
        '#download': 'Export to xls'
    }
}))
