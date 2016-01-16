var tpl = require('Menu.html')

return {
    className: 'content-padded',
    signals;['refreshcache']
    deps:{
        options:'map',
        owner:'models'
    }
    create: function(deps){
        this.el.innerHTML=tpl(deps.options)
    },

    events: {
        'touchstart .signout':function(){
            this.deps.owner.reset()
        },
        'touchstart .restart':function(){
            window.location.reload(true)
        },
        'touchstart .reload':function(){
            this.signals.refreshCache().send()
        }
    }
}
