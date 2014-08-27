var
Module = require('Module')

exports.Class = Module.Class.extend({
    tagName: 'ul',
    className: 'table-view',
    create: function(spec){
        var
        models = this.requireAllType('models'),
        indexKey = this.requireType('text'),
        doctorId = this.requireType('number'),
        list = this.require('list'),
        index

        list.fetch({
            data: {doctorId:doctorId},
            success:function(model, raw){
                var coll 
                for(var key in raw){
                    if (key === indexKey) continue
                    coll = models[key]
                    if (!coll) continue
                    coll.add(raw[key])
                }
                models[indexKey].add(raw[indexKey]).forEach(function(model){
                    self.addRow(model)
                })
            }
        })
        self.triggerHost('invalidate')
    },

    render: function(){
        return this.$el
    },

    addRow: function(model){
        this.proxy(this.Cell, [model.id])
    },

    moduleEvents: function(evt, sender){
        switch(evt){
        case 'invalidate': this.$el.append(sender.render()); break
        }
    }
})
