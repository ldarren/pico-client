var Module = require('Module')

exports.Class = Module.Class.extend({
    initialize: function(options){
        var self = this

        this.init(options, function(err, spec){
            for(var s,i=0,l=spec.length; i<l,s=spec[i]; i++){
                switch(s.type){
                case 'select': self.select = s; break
                }
            }
            self.triggerHost('Hello')
        })
    }
})
