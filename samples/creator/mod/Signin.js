var tpl = require('@mod/Signin.html')

exports.Class = {
    signals: [],
    deps: {
    },
    tagName: 'form',
    create: function(deps){
        this.el.innerHTML = tpl.text
    },
    slots: {
    }
}
