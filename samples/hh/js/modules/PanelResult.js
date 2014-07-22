var Module = require('Module')

me.Class = Module.Class.extend({
    initialize: function(options){
        var self = this

        Module.Class.prototype.initialize.call(this, options, function(err, spec){
            var item, sub

            for(var s,i=0,l=spec.length; i<l, s=spec[i]; i++){
                switch(s.type){
                case 'model': item = s.value; break
                case 'module': sub = s; break
                }
            }

            var
            spec = sub.spec[0],
            value = spec.value

            value.length = 0
            spec.title = 'Lab Result'
            value.push((new Date(item.get('createdAt'))).toLocaleString())
            value.push(item.get('desc'))

            new sub.Class({name:sub.name, host:self.host, spec:sub.spec})
        })
    },

    render: function(){
        return this.panelDesc.render()
    },

    drawModule: function(mod){
        this.panelDesc = mod
        this.invalidate()
    }
})
