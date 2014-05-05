require.config({
    baseUrl:'.',
    paths:{
        jquery: 'lib/zepto.1.1.3.min',
        underscore: 'lib/underscore.1.6.0.min',
        backbone: 'lib/backbone.1.1.2.min',
        text: 'lib/text.2.0.10.min',
        views: 'js/views',
        models: 'js/models',
        lib: 'js/lib'
    },
    shim: {
        jquery:{
            exports:'$'
        },
        underscore:{
            exports: '_'
        },
        backbone:{
            exports: 'Backbone',
            deps:['underscore', 'jquery']
        },
    },
    deps:[],
    callback: function(){
    }
});
