var Module = require('Module')

exports.Class = Module.Class.extend({
    create: function(spec, params){
        for(var i=0,s; s=spec[i]; i++){
            if ('module' === s.type) {
                this.proxy(s, params, this)
            }
        }
    }
})
