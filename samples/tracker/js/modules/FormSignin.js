var
Module = require('Module'),
tpl = require('@html/FormSignin.html'),
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
        'click button[name=signin]': 'signin'
    },

    signin: function(e){
        var self = this
        this.owner.reset()
        this.auth.create(null, {
            data: {
                un: this.$('input[name=username]').val().trim(),
                passwd: common.hash(this.$('input[name=password]').val())
            },
            success:function(coll, raw){
                self.owner.add(raw)
            }
        })
    }
})
