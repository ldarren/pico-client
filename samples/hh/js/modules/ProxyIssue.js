var Module = require('Module')

exports.Class = Module.Class.extend({
    create: function(spec){
        var item, sub, issues
        for(var s,i=0; s=spec[i]; i++){
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
        spec.name = 'Current Issue'
        value.push(issue.get('desc'))

        this.proxy(sub)
    }
})
