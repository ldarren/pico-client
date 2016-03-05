var
clickable = function(self){
    var cl = self.el.classList
    if (!cl.contains('hidden')) cl.remove('unclickable')
}

return {
    className: 'leftMenu hidden unclickable',
    signals:['invalidate','pageSlide'],
    deps:{
		tpl:'file',
        side:'text',
        menu:'list'
    },
    create: function(deps){
        this.delayId = 0
//        this.signals.invalidate().send(this.host)
    },
    slots: {
        userReady:function(from, sender, model){
            this.el.innerHTML = this.deps.tpl({menu:this.deps.menu, user:model.attributes})
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
