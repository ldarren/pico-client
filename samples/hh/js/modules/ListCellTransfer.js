var
Module = require('Module'),
tpl = require('@html/listCell.html')

exports.Class = Module.Class.extend({
    tagName: 'li',
    className: 'table-view-cell',
    create: function(spec){
        var
        transfer = this.requireType('model').value,
        patients = this.require('patient').value,
        issues = this.require('issue').value,
        wards = this.require('ward').value

        if (!transfer || !patients || !issues || !wards) return console.error('missing field for ListItemTransfer')
        this.patient = patients.get(issues.get(transfer.get('issueId')).get('patientId'))
        this.ward = wards.get(this.patient.get('wardId'))
        this.transfer = transfer
        this.triggerHost('invalidate')
    },
    render: function(){
        var p=this.patient, w=this.ward
        this.$el.html(_.template(tpl.text, {
            url: 'transfer/' + this.transfer.id,
            title: p.get('name')+' ('+p.get('ic')+')',
            desc: w.get('specialty')+' '+w.get('name')
        }))
        return this.el
    }
})
