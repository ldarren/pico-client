var Module = require('Module')

exports.Class = Module.Class.extend({
    create: function(spec){
        var
        title = this.require('title') || {},
        left = this.require('left') || {},
        right = this.require('right') || {}

        this.title = title.value || ''
        this.left = left.value || []
        this.right = right.value || []

        this.triggerHost('header', {title:this.title,left:this.left,right:this.right})
    },
    moduleEvents: function(evt, sender){
        switch(evt){
        case 'changeHeader':
            var header = arguments[2]
            if (!header) return
            var
            l = header.left || [],
            r = header.right || []
            this.triggerHost('header', {title:header.title || this.title, left:this.left.concat(l),right:r.concat(this.right)})
            break
        default:
            Module.Class.prototype.moduleEvents.apply(this, arguments)
            break
        }
    }
})
