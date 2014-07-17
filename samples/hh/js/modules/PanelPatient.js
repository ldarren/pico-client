var Module = require('Module')

me.Class = Module.Class.extend({
    initialize: function(options){
        var
        self = this,
        fields = Module.Class.prototype.initialize.call(this, options),
        item, sub, issues, patients

        for(var f,i=0,l=fields.length; i<l; i++){
            f = fields[i]
            switch(f.type){
            case 'model':
                if ('item' === f.extra){
                    item = f.value
                }
                switch(f.name){
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
            p = patients.get(issues.get(item.get('issueId'))),
            $el = self.$el,
            view = new mod.Class(self.createOptions([
                {name: 'title', type:'text', value: 'Patient Info'},
                {name: 'Name', type:'text', value: p.get('name')},
                {name: 'IC', type:'text', value: p.get('ic')}
            ]))
            $el.append(view.render())
        })
    },

    render: function(){
        return this.$el
    }
})
