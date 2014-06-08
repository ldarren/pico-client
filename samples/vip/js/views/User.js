var
network = require('network'),
route = require('route');

me.Class = Backbone.View.extend({
    model: null,
    initialize: function(options){
        var model = this.model = options.user;
        if (model && model.id){
            pico.embed(this.el, 'html/updateUser.html', function(){})
        }else{
            pico.embed(this.el, 'html/createUser.html', function(){})
        }
    },

    getHeader: function(){
        var title = this.model && this.model.id ? 'Update Profile' : 'Create Profile';
        return {
            left: 'left-nav',
            right: 'check',
            title: title,
            options:{
                'company/create': 'New company'
            }
        }
    },

    render: function(){
        return this
    },

    events: {
        'check': 'submit'
    },

    submit: function(){
        this.model.save(null, {
            data: this.$('form')[0],
            success: function(model, res){
                alert('Profile updated');
                route.instance.navigate('', {trigger:true});
            },
            error: function(err){
                alert('Form submit error: '+err);
            }
        })
    }
})
