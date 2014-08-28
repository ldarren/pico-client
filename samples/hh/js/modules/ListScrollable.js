var Module = require('Module')

exports.Class = Module.Class.extend({
    tagName: 'ul',
    className: 'table-view',
    create: function(spec){
        var
        self = this,
        models = this.requireAllType('models'),
        indexKey = this.requireType('text').value,
        doctorId = this.requireType('number').value,
        list = this.require('list').value,
        index

        this.Cell = this.requireType('module')

        list.fetch({
            data: {doctorId:doctorId},
            success:function(model, raw){
                var coll 
                for(var key in raw){
                    if (key === indexKey) continue
                    coll = models[key].value
                    if (!coll) continue
                    coll.add(raw[key])
                }
                models[indexKey].value.add(raw[indexKey]).forEach(function(model){
                    self.addRow(model)
                })
            }
        })
        this.triggerHost('invalidate')
    },

    moduleEvents: function(evt, sender){
        switch(evt){
        case 'invalidate': this.$el.append(sender.render()); break
        }
    },

    addRow: function(model){
        this.proxy(this.Cell, [model.id])
    }
})
