require.config({
    baseUrl: '.',
    paths: {
        jquery: '//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.0/jquery.min',
        underscore: '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min',
        backbone: '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min',
        lib: 'js/lib',
        views: 'js/views',
        models: 'js/models',
        text: 'js/lib/text'
    },
    deps: [
        'lib/date.format',
        'lib/touch',
        'lib/data',
        'plugins/mobiscroll/js/mobiscroll.select',
        'plugins/mobiscroll/js/mobiscroll.datetime'
    ],
    shim: {
        'jquery': {exports: '$'},
        'lib/touch': ['jquery'],
        'lib/data': ['jquery'],
        'plugins/mobiscroll/js/mobiscroll.zepto': ['jquery'],
        'plugins/mobiscroll/js/mobiscroll.core': ['plugins/mobiscroll/js/mobiscroll.zepto'],
        'plugins/mobiscroll/js/mobiscroll.scroller': ['plugins/mobiscroll/js/mobiscroll.core'],
        'plugins/mobiscroll/js/mobiscroll.scroller.ios7': ['plugins/mobiscroll/js/mobiscroll.scroller'],
        'plugins/mobiscroll/js/mobiscroll.select': ['plugins/mobiscroll/js/mobiscroll.scroller.ios7'],
        'plugins/mobiscroll/js/mobiscroll.datetime': ['plugins/mobiscroll/js/mobiscroll.scroller.ios7']
    },
    config: {
        text: {
            useXhr: function (url, protocol, hostname, port) {
                return true;
            }
        }
    }
});
