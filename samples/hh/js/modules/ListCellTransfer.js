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
            transfer, patients, issues, wards
            for(var s,i=0; s=spec[i]; i++){
                switch(s.type){
                case 'model': transfer = s.value; break
                case 'models':
                    switch (s.name){
                    case 'patient': patients = s.value; break
                    case 'issue': issues = s.value; break
                    case 'ward': wards = s.value; break
                    }
                    break
                }
            }
            if (!transfer || !patients || !issues || !wards) return console.error('missing field for ListItemTransfer')
            self.patient = patients.get(issues.get(transfer.get('issueId')).get('patientId'))
            self.ward = wards.get(self.patient.get('wardId'))
            self.transfer = transfer
            self.triggerHost('invalidate')
        })
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
