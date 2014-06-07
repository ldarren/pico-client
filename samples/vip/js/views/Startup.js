var
network = require('network'),
route = require('route');

me.Class = Backbone.View.extend({
    initialize: function(){
        var self = this;
        pico.embed(self.el, 'html/startup.html', function(){
        })
    },

    getHeader: function(){
        return {
            left: 'left-nav',
            right: 'check',
            title: 'New Organization',
            options:{
                user: 'UserProfile'
            }
        }
    },

    render: function(){
        return this
    },

    events: {
        'touchstart input#logoProxy': function(){this.$('input#logo').click()},
        'change input#logo': function(){this.$('input#logoProxy').val(this.$('input#logo').val().split(/(\\|\/)/g).pop())},
        'check': 'submit'
    },

    submit: function(){
        network.submit(this.$('form')[0], function(err, data){
            if (err) return alert('Form submit error: '+err);
            alert('New company created');
            route.instance.navigate('', {trigger:true});
        })
    }
})
