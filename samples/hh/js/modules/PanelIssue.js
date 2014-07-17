var Module = require('Module')

me.Class = Module.Class.extend({
    initialize: function(options){
        var
        self = this,
        fields = Module.Class.prototype.initialize.call(this, options),
        item, sub, issues

        for(var f,i=0,l=fields.length; i<l; i++){
            f = fields[i]
            switch(f.type){
            case 'model':
                if ('item' === f.extra){
                    item = f.value
                }
                if ('issue' === f.name){
                    issues = f.value
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
            issue = issues.get(item.get('issueId')),
            $el = self.$el,
            view = new mod.Class(self.createOptions([
                {name: 'title', type:'text', value: 'Current Issue'},
                {name: 'desc', type:'text', value: issue.get('desc')}
            ]))
            $el.append(view.render())
        })
    },

    render: function(){
        return this.$el
    }
})
