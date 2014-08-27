var Module = require('Module')

exports.Class = Module.Class.extend({
    create: function(spec){
        var item, sub

        for(var s,i=0; s=spec[i]; i++){
            switch(s.type){
            case 'model': item = s.value; break
            case 'module': sub = s; break
            }
        }

        var
        spec = sub.spec[0],
        value = spec.value

        value.length = 0
        spec.name = 'Lab Result'
        value.push((new Date(item.get('createdAt'))).toLocaleString())
        value.push(item.get('desc'))

        this.proxy(sub)
    }
})
