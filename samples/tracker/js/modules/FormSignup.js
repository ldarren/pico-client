var
Module = require('Module'),
tpl = require('@html/FormSignup.html'),
common = require('modules/common')

exports.Class = Module.Class.extend({
    tagName: 'form',
    className: 'content-padded',
    create: function(spec){
        this.owner = this.require('owner').value
        this.auth = this.require('auth').value

		this.$el.html(_.template(tpl.text))
        this.triggerHost('invalidate')
    },

    events: {
        'click button[name=signup]': 'signup'
    },

    signup: function(e){
        var
        self = this,
        un = this.$('input[name=un]').val().trim(),
        passwd = this.$('input[name=passwd]').val(),
        name = this.$('input[name=name]').val().trim(),
        tel = this.$('input[name=tel]').val().trim(),
        email = this.$('input[name=email]').val().trim()
        if (!passwd || !un || !tel || !email || !name) return
        if (passwd !== this.$('input[name=confirm]').val()) return
        this.owner.reset()
        this.auth.create(null, {
            data: {
                un: un,
                passwd: common.hash(passwd),
                tel: tel,
                email: email,
                name: name
            },
            success:function(coll, raw){
                self.owner.add(raw)
            }
        })
    }
})
