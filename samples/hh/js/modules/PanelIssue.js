var Module = require('Module')

me.Class = Module.Class.extend({
    initialize: function(options){
        this.on('invalidate', this.drawModule)
        var self = this
        
        Module.Class.prototype.initialize.call(this, options, function(err, spec){
            var item, sub, issues
            for(var s,i=0,l=spec.length; i<l,s=spec[i]; i++){
                switch(s.type){
                case 'model': item = s.value; break
                case 'models': issues = s.value; break
                case 'module': sub = s; break
                }
            }

            var
            issue = issues.get(item.get('issueId')),
            spec = sub.spec[0],
            value = spec.value

            value.length = 0
            spec.title = 'Current Issue'
            value.push(issue.get('desc'))

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
