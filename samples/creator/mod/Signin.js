var
tpl = require('@mod/Signin.html'),
hash = function(raw){
    var hash = 2574;
    if (raw.length == 0) return hash;
    for (var i=0,c; c=raw.charCodeAt(i); i++){
        hash = ((hash<<5)-hash)+c;
        hash = hash & hash; // Convert to 32bit integer
    }
    return btoa(hash.toString(36))
}

exports.Class = {
    signals: [],
    deps: {
        owner: 'models',
        auth: 'models'
    },
    tagName: 'form',
    create: function(deps){
        this.el.innerHTML = tpl.text
    },
    events:{
        'click button[name=signin]': function(e){
            var
            self = this,
            deps = this.deps

            deps.owner.reset()
            deps.auth.create(null, {
                data: {
                    un: this.$('input[name=username]').val().trim(),
                    passwd: hash(this.$('input[name=password]').val())
                },
                success:function(coll, raw){
                    deps.owner.add(raw)
                }
            })
        }
    },
    slots: {
    }
}
