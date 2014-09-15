var
Module = require('Module')
tpl = require('@html/drawer.html')

exports.Class = Module.Class.extend({
    create: function(spec){
        this.isLeft = this.require('side').value === 'left'
        this.el.innerHTML = tpl.text
        this.rightMenu = this.el.querySelector('.rightMenu')
        this.rightMenu.classList.add('hidden')
        this.triggerHost('invalidate')
    },
    moduleEvents: function(evt, sender){
        switch(evt){
        case 'menu':
            var
            left = arguments[2],
            detail = null
            if (left !== this.isLeft) return
            if (this.rightMenu.classList.contains('hidden')){
                detail = {from:left ? 'left' : 'right', ref:this.rightMenu}
            }
            this.rightMenu.classList.remove('hidden')
            this.triggerHost('slide', detail)
            break
        case 'mainTransited':
            if (0 === arguments[2]) this.rightMenu.classList.add('hidden')
            break
        }
    }
})
