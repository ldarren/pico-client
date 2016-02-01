var
tpl = require('Drawer.asp'),
clickable = function(self){
    var cl = self.el.classList
    if (!cl.contains('hidden')) cl.remove('unclickable')
}

return {
    className: 'leftMenu hidden unclickable',
    signals:['invalidate','pageSlide'],
    deps:{
        side:'text',
        menu:'list'
    },
    create: function(deps){
        this.delayId = 0
//        this.signals.invalidate().send(this.host)
    },
    slots: {
        userReady:function(from, sender, model){
            this.el.innerHTML = tpl({menu:this.deps.menu, user:model})
        },
        menu: function(from, sender, side){
            var options = null

            if (side !== this.deps.side) return
            if (this.el.classList.contains('hidden')){
                options = {from:side, ref:this.el}
            }
            this.el.classList.remove('hidden')
            this.signals.pageSlide(options).send(this.host)
        },
        pageSlided: function(from, sender, x, y){
            if (x){
                this.delayId = setTimeout(clickable, 500, this)
            }else{
                clearTimeout(this.delayId)
                this.el.classList.add('hidden','unclickable')
            }
        }
    }
}
