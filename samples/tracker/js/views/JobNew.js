var route = require('route');

me.Class = Backbone.View.extend({
    collection: null,
    initialize: function(options){
        var self = this;
        self.collection = options.collection;
        pico.embed(self.el, 'html/jobNew.html', function(){
            var now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            var str = now.toISOString();
            self.$('input[type=date]').val(str.slice(0, 10));
            self.$('input[type=time]').val(str.slice(11, 19));
        })
    },

    getHeader: function(){
        return {
            title: 'New Job',
            left: ['left-nav'],
            right: ['check'],
        }
    },

    render: function(){
        return this
    },

    events: {
        'check': 'submit'
    },

    submit: function(){
        this.collection.create(null, {
            data: this.el.querySelector('form'),
            success: function(model, data){
                route.instance.navigate('job/list', {trigger:true});
            }
        })
    }
})
