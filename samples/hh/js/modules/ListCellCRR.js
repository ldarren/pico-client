var
Module = require('Module'),
tpl = require('@html/listCell.html')

me.Class = Module.Class.extend({
    tagName: 'li',
    className: 'table-view-cell',
    patient:null,
    result:null,
    initialize: function(options){
        var
        fields = Module.Class.prototype.initialize.call(this, options),
        patients, issues

        for(var f,i=0,l=fields.length; i<l; i++){
            f = fields[i]
            switch(f.type){
            case 'model':
                if ('item' === f.extra) {
                    this.result = f.value
                    continue
                }
                switch (f.name){
                case 'patient': patients = f.value; break
                case 'issue': issues = f.value; break
                }
                break
            }
        }
        if (!this.result || !patients || !issues) return console.error('missing field for ListItemCRR')
        this.patient = patients.get(issues.get(this.result.get('issueId')).get('patientId'))
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
