var
Module = require('Module'),
tpl = require('@html/listCell.html')

exports.Class = Module.Class.extend({
    tagName: 'li',
    className: 'table-view-cell',
    create: function(spec){
        var
        patients = this.require('patient').value,
        issues = this.require('issue').value
        
        this.result = this.requireType('model').value

        if (!this.result || !patients || !issues) return console.error('missing field!')
        this.patient = patients.get(issues.get(this.result.get('issueId')).get('patientId'))
        this.triggerHost('invalidate')
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
