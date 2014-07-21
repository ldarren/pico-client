var Module = require('Module')

me.Class = Module.Class.extend({
    initialize: function(options){
        this.on('invalidate', this.drawModule)
        var self = this

        Module.Class.prototype.initialize.call(this, options, function(err, spec){
            var item, sub, issues, patients

            for(var s,i=0,l=spec.length; i<l,s=spec[i]; i++){
                switch(s.type){
                case 'model':
                    item = s.value
                    break
                case 'models':
                    switch(s.name){
                    case 'issue': issues = s.value; break
                    case 'patient': patients = s.value; break
                    }
                    break
                case 'module':
                    sub = s
                    break
                }
            }
            var
            p = patients.get(issues.get(item.get('issueId'))),
            f = sub.spec[0],
            value = f.value

            f.name = 'Patient Info'
            value.length = 0
            value.push({name: 'Name', value: p.get('name')})
            value.push({name: 'IC', value: p.get('ic')})
            new sub.Class({name:sub.name, host:self, spec:sub.spec})
        })
    },

    render: function(){
        return this.panelInfo.render()
    },

    drawModule: function(mod){
        this.panelInfo = mod
        this.invalidate()
    }
})
