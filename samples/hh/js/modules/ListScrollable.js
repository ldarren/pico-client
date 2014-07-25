var
Module = require('Module')

exports.Class = Module.Class.extend({
    tagName: 'ul',
    className: 'table-view',
    initialize: function(options){
        var self = this

        this.init(options, function(err, spec){
            var
            models = {},
            index, indexKey, doctorId, list 

            for(var i=0,l=spec.length,s; i<l,s=spec[i]; i++){
                switch(s.type){
                case 'models':
                    if ('list' === s.name) list = s.value
                    else models[s.name] = s.value
                    break
                case 'module': self.cell = s; break
                case 'number': doctorId = s.value; break
                case 'text': indexKey = s.value; break
                }
            }

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
            self.invalidate()
        })
    },

    render: function(){
        return this.$el
    },

    addRow: function(model){
        var cell = this.cell
        this.createSubModule(cell, [model.id])
    },

    drawModule: function(mod){
        this.$el.append(mod.render())
    }
})
