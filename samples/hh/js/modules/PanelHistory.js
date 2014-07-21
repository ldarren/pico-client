var Module = require('Module')

me.Class = Module.Class.extend({
    initialize: function(options){
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
                    case 'issue': issues = this.issues = s.value; break
                    case 'result': results = this.results = s.value; break
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
                    url: 'hh/history/list',
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
        return this.$el
    },

    addRows: function(mod, history){
        var
        self = this,
        $el = self.$el,
        options = [{name: 'title', type:'text', value: 'Relevant History'}]

        history.forEach(function(model){
            options.push({
                name: 'desc',
                type:'text',
                value: self.issues.get(model.get('issueId')).get('desc')+': '+self.results.get(model.get('resultId')).get('desc')
            })
        })
        
        var view = new mod.Class(self.createOptions(options))
        $el.append(view.render())
    }
})
