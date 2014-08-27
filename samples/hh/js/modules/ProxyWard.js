var Module = require('Module')

exports.Class = Module.Class.extend({
    create: function(spec){
        var item, sub, wards, issues, patients
        for(var s,i=0; s=spec[i]; i++){
            switch(s.type){
            case 'model': item = s.value; break
            case 'models':
                switch(s.name){
                case 'ward': wards = s.value; break
                case 'issue': issues = s.value; break
                case 'patient': patients = s.value; break
                }
                break
            case 'module': sub = s; break
            }
        }
        var
        w = wards.get(patients.get(issues.get(item.get('issueId')).get('patientId')).get('wardId')),
        spec = sub.spec[0],
        value = spec.value

        value.length = 0
        spec.name = 'Location'
        value.push({name: 'Specialty', value:w.get('specialty')})
        value.push({name: 'Subspecialty', value:w.get('subSpecialty')})
        value.push({name: 'Ward', value:w.get('name')})
        this.proxy(sub)
    }
})
