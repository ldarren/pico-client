var
Module = require('Module'),
tpl = require('@html/listCell.html')

exports.Class = Module.Class.extend({
    tagName: 'li',
    className: 'table-view-cell',
    initialize: function(options){
        var self = this

        this.init(options, function(err, spec){
            var
            patients, issues
            for(var s,i=0,l=spec.length; i<l,s=spec[i]; i++){
                switch(s.type){
                case 'model': self.result = s.value; break
                case 'models':
                    switch (s.name){
                    case 'patient': patients = s.value; break
                    case 'issue': issues = s.value; break
                    }
                    break
                }
            }
            if (!self.result || !patients || !issues) return console.error('missing field for ListItemCRR')
            self.patient = patients.get(issues.get(self.result.get('issueId')).get('patientId'))
            self.triggerHost('invalidate')
        })
    },
    render: function(){
        var p=this.patient, r=this.result
        this.$el.html(_.template(tpl.text, {
            url: 'crr/' + r.id,
            title: p.get('name')+' ('+p.get('ic')+')',
            desc: r.get('desc')
        }))
        return this.el
    }
})
