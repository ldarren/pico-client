var
Module = require('Module'),
tpl = require('@html/listCell.html')

me.Class = Module.Class.extend({
    tagName: 'li',
    className: 'table-view-cell',
    initialize: function(options){
        var
        fields = Module.Class.prototype.initialize.call(this, options),
        transfer, patients, issues, wards

        for(var f,i=0,l=fields.length; i<l; i++){
            f = fields[i]
            switch(f.type){
            case 'model':
                if ('item' === f.extra) {
                    transfer = this.transfer = f.value
                    continue
                }
                switch (f.name){
                case 'patient': patients = f.value; break
                case 'issue': issues = f.value; break
                case 'ward': wards = f.value; break
                }
                break
            }
        }
        if (!transfer || !patients || !issues || !wards) return console.error('missing field for ListItemTransfer')
        this.patient = patients.get(issues.get(transfer.get('issueId')).get('patientId'))
        this.ward = wards.get(this.patient.get('wardId'))
        
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
