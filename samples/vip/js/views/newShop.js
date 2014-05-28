me.Class = Backbone.View.extend({
    initialize: function(){
        var self = this;
        pico.embed(self.el, 'html/newShop.html', function(){
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
        return this;
    },

    events: {
        'touchstart input#logoProxy': function(){this.$('input#logo').click()},
        'change input#logo': function(){this.$('input#logoProxy').val(this.$('input#logo').val().split(/(\\|\/)/g).pop())},
        'touchstart input#tagsProxy': function(e){
            e.preventDefault();
            e.stopPropagation();
            var tags = this.$('select#tags');
            tags.trigger('mousedown')
        },
        'change select#tags': function(){this.$('input#tagsProxy').val(this.$('select#tags').val())},
        'check': 'submit'
    },

    submit: function(){
        console.log(this.$('form').serializeObject());
    }
});
