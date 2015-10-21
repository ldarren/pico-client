var
tpl = require('Drawer.html'),
clickable = function(self){
    var cl = self.el.classList
    if (!cl.contains('hidden')) cl.remove('unclickable')
}

return {
    className: 'leftMenu hidden unclickable',
    signals:['invalidate','slide'],
    deps:{
        side:'text',
        menu:'list'
    },
    create: function(deps){
        this.delayId = 0
        this.signals.invalidate().send(this.host)
    },
    slots: {
        signin:function(from, sender, model){
            this.el.innerHTML = tpl({menu:this.deps.menu, user:model.attributes})
        },
        menu: function(from, sender, side){
            var options = null

            if (side !== this.deps.side) return
            if (this.el.classList.contains('hidden')){
                options = {from:side, ref:this.el}
            }
            this.el.classList.remove('hidden')
            this.signals.slide(options).send(this.host)
        },
        mainTransited: function(from, sender, x, y){
            if (x){
                this.delayId = setTimeout(clickable, 500, this)
            }else{
                clearTimeout(this.delayId)
                this.el.classList.add('hidden','unclickable')
            }
        }
    }
}
