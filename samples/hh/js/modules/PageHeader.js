var Module = require('Module')

exports.Class = Module.Class.extend({
    create: function(spec){
        var
        title = this.require('title') || {},
        left = this.require('left') || {},
        right = this.require('right') || {}

        this.triggerHost('header', {title:title.value,left:left.value,right:right.value})
    }
})
