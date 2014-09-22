var
Module = require('Module'),
tpl = require('@html/FormSignup.html'),
hash = function(raw){
    var hash = 2574;
    if (raw.length == 0) return hash;
    for (var i=0,c; c=raw.charCodeAt(i); i++){
        hash = ((hash<<5)-hash)+c;
        hash = hash & hash; // Convert to 32bit integer
    }
    return btoa(hash.toString(36))
}


exports.Class = Module.Class.extend({
    tagName: 'form',
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
        un = this.$('input[name=username]').val().trim(),
        passwd = this.$('input[name=password]').val(),
        mobile = this.$('input[name=mobile]').val().trim(),
        email = this.$('input[name=email]').val().trim(),
        name = this.$('input[name=name]').val().trim()
        if (!passwd || !un || !mobile || !email || !name) return
        if (passwd !== this.$('input[name=confirm]').val()) return
        this.owner.reset()
        this.auth.create(null, {
            data: {
                un: un,
                passwd: hash(passwd),
                mobile: mobile,
                email: email,
                name: name
            },
            success:function(coll, raw){
                self.owner.add(raw)
            }
        })
    }
})
