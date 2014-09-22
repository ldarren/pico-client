var
Module = require('Module'),
tpl = require('@html/FormSignin.html'),
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
        'click button[name=signin]': 'signin'
    },

    signin: function(e){
        var self = this
        this.owner.reset()
        this.auth.create(null, {
            data: {
                un: this.$('input[name=username]').val().trim(),
                passwd: hash(this.$('input[name=password]').val())
            },
            success:function(coll, raw){
                self.owner.add(raw)
            }
        })
    }
})
