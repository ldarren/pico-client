var Module = require('Module')

me.Class = Module.Class.extend({
    initialize: function(options){
        var
        self = this,
        fields = Module.Class.prototype.initialize.call(this, options),
        item, sub, issues, history, results

        for(var f,i=0,l=fields.length; i<l; i++){
            f = fields[i]
            switch(f.type){
            case 'model':
                if ('item' === f.extra){
                    item = f.value
                }
                switch(f.name){
                case 'issue': issues = this.issues = f.value; break
                case 'result': results = this.results = f.value; break
                case 'history': history = f.value; break
                }
                break
            case 'module':
                sub = f.value
                break
            }
        }

        require('modules/'+sub, function(err, mod){
            if (err) return console.error(err)
            var
            patientId = issues.get(item.get('issueId')).get('patientId'),
            patientHistory = history.where({patientId:patientId})
            
            if (patientHistory.length){
                self.addRows(mod, patientHistory)
            }else{
                (new Backbone.Collection).fetch({
                    url: 'hh/history/list',
                    data:{patientId:patientId},
                    success: function(coll, raw){
                        results.add(raw.result)
                        issues.add(raw.issue)
                        history.add(raw.history)
                        self.addRows(mod, history.where({patientId:patientId}))
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
