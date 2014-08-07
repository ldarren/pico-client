var Module = require('Module')

exports.Class = Module.Class.extend({
    initialize: function(options){
        var self = this

        this.init(options, function(err, spec){
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

            self.derive(sub)
        })
    }
})
