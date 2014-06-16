var
network = require('network'),
route = require('route');

me.Class = Backbone.View.extend({
    initialize: function(){
        var self = this;
        pico.embed(self.el, 'html/report.html', function(){
            var now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            var str = now.toISOString();
            self.$('input[name=start]').val(str.slice(0, 10));
            self.$('input[name=end]').val(str.slice(0, 10));
        })
    },

    getHeader: function(){
        return {
            title: 'Report',
            left: 'left-nav',
            right: 'check'
        }
    },

    render: function(){
        return this;
    },

    events: {
        'check': 'submit'
    },

    submit: function(){
        route.instance.navigate('report/invoice/'+this.$('input[name=start]').val()+'/'+this.$('input[name=end]').val(), {trigger:true});
    }
});
