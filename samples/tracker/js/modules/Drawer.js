var
Module = require('Module'),
common = require('modules/common'),
tpl = require('@html/Drawer.html')

exports.Class = Module.Class.extend({
    className: 'rightMenu hidden',
    create: function(spec){
        this.isLeft = this.require('side').value === 'left'
        this.menu = this.require('menu').value
        this.triggerHost('invalidate')
    },
    moduleEvents: function(evt, sender){
        switch(evt){
        case 'menu':
            var
            left = arguments[2],
            detail = null
            if (left !== this.isLeft) return
            if (this.el.classList.contains('hidden')){
                detail = {from:left ? 'left' : 'right', ref:this.el}
            }
            this.el.classList.remove('hidden')
            this.triggerHost('slide', detail)
            break
        case 'mainTransited':
            if (0 === arguments[2]) this.el.classList.add('hidden')
            break
        case 'userReady':
            var user = arguments[2]
            if (!user) return
            this.el.innerHTML = ''
            var
            allow = common.viewablePages(user.get('user')),
            menu = this.menu.filter(function(m){ return -1 !== allow.indexOf(m.url) })

            this.$el.html(_.template(tpl.text, {menu:menu, user:user.get('json')}))
            break
        }
    }
})
