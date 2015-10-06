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
        users:'models',
        side:'text',
        menu:'list'
    },
    create: function(deps){
        this.delayId = 0
        this.signals.invalidate().send(this.host)
    },
    slots: {
        signin:function(from, sender, model){
            var self=this
            this.deps.users.retrieve([model.id],function(err, coll, raw){
                if (err) return console.error(err)
                var
                u=coll.get(model.id),
                meta

                if (!u) return

                meta=u.get('meta')
                if('string'===typeof meta){
                    try{meta=JSON.parse(u.get('meta'))}
                    catch(exp){console.error(exp)}

                    u.set('meta',meta)
                }

                self.el.innerHTML = tpl({menu:self.deps.menu, user:meta})
            })
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
