var
Module = require('Module')
tpl = require('@html/Drawer.html')

exports.Class = Module.Class.extend({
    className: 'rightMenu',
    create: function(spec){
        this.isLeft = this.require('side').value === 'left'
        this.owner = this.require('owner').value
        this.data = this.require('data').value
        this.menu = this.require('menu').value
        this.el.classList.add('hidden')
        this.triggerHost('invalidate')
        if (this.owner.length) this.login(this.owner.models[0])
        this.listenTo(this.owner, 'add', this.login)
    },
    login: function(model){
        var user = this.data.get(model.id)
        this.el.innerHTML = ''
        this.$el.html(_.template(tpl.text, {menu:this.menu, user:user.get('json')}))
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
        }
    }
})
