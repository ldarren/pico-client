var Module = require('Module')

exports.Class = Module.Class.extend({
    create: function(spec){
        this.triggerHost('Hello')
    }
})
