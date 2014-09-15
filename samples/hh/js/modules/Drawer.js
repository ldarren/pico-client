var
Module = require('Module')
tpl = require('@html/drawer.html')

exports.Class = Module.Class.extend({
    create: function(spec){
        this.isLeft = this.require('side').value === 'left'
        this.el.innerHTML = tpl.text
        this.triggerHost('invalidate')
    },
    moduleEvents: function(evt, sender, isLeft){
        if ('menu' !== evt || isLeft !== this.isLeft) return
        this.triggerHost('slide', isLeft ? 'left' : 'right', this.el.querySelector('.rightMenu'))
    }
})
