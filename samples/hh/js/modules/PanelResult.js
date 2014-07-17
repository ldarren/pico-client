var Module = require('Module')

me.Class = Module.Class.extend({
    initialize: function(options){
        var
        self = this,
        fields = Module.Class.prototype.initialize.call(this, options),
        item, sub

        for(var f,i=0,l=fields.length; i<l; i++){
            f = fields[i]
            switch(f.type){
            case 'model':
                if ('item' === f.extra){
                    item = f.value
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
            $el = self.$el,
            view = new mod.Class(self.createOptions([
                {name: 'title', type:'text', value: 'Lab Result'},
                {name: 'Date', type:'text', value: (new Date(item.get('createdAt'))).toLocaleString()},
                {name: 'Result', type:'text', value: item.get('desc')}
            ]))
            $el.append(view.render())
        })
    },

    render: function(){
        return this.$el
    }
})
