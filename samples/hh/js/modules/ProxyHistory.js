var Module = require('Module')

exports.Class = Module.Class.extend({
    create: function(spec){
        var item, sub, issues, history, results, list

        for(var s,i=0; s=spec[i]; i++){
            switch(s.type){
            case 'model':
                item = s.value
                break
            case 'models':
                switch(s.name){
                case 'issue': issues = this.issues = s.value; break
                case 'result': results = this.results = s.value; break
                case 'history': history = s.value; break
                case 'list': list = s.value; break
                }
                break
            case 'module':
                sub = s
                break
            }
        }

        var
        patientId = issues.get(item.get('issueId')).get('patientId'),
        patientHistory = history.where({patientId:patientId})
        
        if (patientHistory.length){
            this.addRows(sub, patientHistory)
        }else{
            var self = this
            list.fetch({
                data:{patientId:patientId},
                success: function(coll, raw){
                    results.add(raw.result)
                    issues.add(raw.issue)
                    history.add(raw.history)
                    self.addRows(sub, history.where({patientId:patientId}))
                }
            })
        }
    },

    addRows: function(mod, history){
        var
        self = this,
        s = mod.spec[0],
        value = s.value

        value.length = 0
        s.name = 'Relevant History'

        history.forEach(function(model){
            value.push(self.issues.get(model.get('issueId')).get('desc')+': '+self.results.get(model.get('resultId')).get('desc'))
        })
        
        this.proxy(mod)
    }
})
