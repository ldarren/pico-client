var
network = require('network'),
route = require('route');

me.Class = Backbone.View.extend({
    initialize: function(){
        var self = this;
        pico.embed(self.el, 'html/jobNew.html', function(){
        })
    },

    getHeader: function(){
        return {
            title: 'New Job',
            left: 'left-nav',
            right: 'check',
        }
    },

    render: function(){
        return this
    },

    events: {
        'check': 'submit'
    },

    submit: function(){
        network.submit(this.$('form')[0], function(err, data){
            if (err) return alert('Form submission error: '+err);
            alert('New job created');
            route.instance.navigate('', {trigger:true});
        })
    }
})
