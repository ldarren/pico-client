var Module = require('Module')

me.Class = Module.Class.extend({
    initialize: function(options){
        this.on('invalidate', this.drawModule)
        var self = this

        Module.Class.prototype.initialize.call(this, options, function(err, spec){
            var item, sub, issues, history, results, list

            for(var s,i=0,l=spec.length; i<l, s=spec[i]; i++){
                switch(s.type){
                case 'model':
                    item = s.value
                    break
                case 'models':
                    switch(s.name){
                    case 'issue': issues = self.issues = s.value; break
                    case 'result': results = self.results = s.value; break
                    case 'history': history = s.value; break
                    case 'list': list = s.value; break
                    }
                    break
                case 'module':
                    sub = s.value
                    break
                }
            }

            var
            patientId = issues.get(item.get('issueId')).get('patientId'),
            patientHistory = history.where({patientId:patientId})
            
            if (patientHistory.length){
                self.addRows(sub, patientHistory)
            }else{
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
        })
    },

    render: function(){
        return this.panelDesc.render()
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
        
        new mod.Class({name: mod.name, host:this, spec:mod.spec})
    },

    drawModule: function(mod){
        this.panelDesc = mod
        this.invalidate()
    }
})
