var Module = require('Module')

me.Class = Module.Class.extend({
    initialize: function(options){
        var
        self = this,
        fields = Module.Class.prototype.initialize.call(this, options),
        item, sub, wards, issues, patients

        for(var f,i=0,l=fields.length; i<l; i++){
            f = fields[i]
            switch(f.type){
            case 'model':
                if ('item' === f.extra){
                    item = f.value
                }
                switch(f.name){
                case 'ward': wards = f.value; break
                case 'issue': issues = f.value; break
                case 'patient': patients = f.value; break
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
            w = wards.get(patients.get(issues.get(item.get('issueId')).get('patientId')).get('wardId')),
            $el = self.$el,
            view = new mod.Class(self.createOptions([
                {name: 'title', type:'text', value: 'Location'},
                {name: 'Specialty', type:'text', value: w.get('specialty')},
                {name: 'Subspecialty', type:'text', value: w.get('subSpecialty')},
                {name: 'Ward', type:'text', value: w.get('name')}
            ]))
            $el.append(view.render())
        })
    },

    render: function(){
        return this.$el
    }
})
