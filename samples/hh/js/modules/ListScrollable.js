var
Module = require('Module')

me.Class = Module.Class.extend({
    template: _.template('<ul class=table-view></ul>'),
    subModule: null,
    initialize: function(options){
        var
        self = this,
        fields = Module.Class.prototype.initialize(options),
        index, indexKey, sub, models, doctorId, url

        for(var f,i=0,l=fields.length; i<l; i++){
            f = fields[i]
            switch(f.type){
            case 'model':
                if ('index' === f.extra){
                    indexKey = f.name
                    index = f.value
                }
                models[f.name] = f.value
                break
            case 'module':
                sub = f.value
                break
            case 'number':
                doctorId = f.value
                break
            case 'url':
                url = f.value
                break
            }
        }

        this.$el.html(this.template())
        this.listenTo(index, 'add', this.addRow)

        require('modules/'+sub, function(err, mod){
            if (err) return console.error(err)
            self.subModule = mod

            if (index.length){
                index.forEach(function(model){
                    self.addRow(model)
                })
            }else{
                (new (Backbone.Model.extend())).fetch({
                    url: url,
                    data:{ doctorId: doctorId },
                    success:function(model, raw){
                        var model
                        for(var key in raw){
                            if (key === indexKey) continue
                            model = models[key]
                            if (!model) continue
                            model.add(raw[key])
                        }
                        index.add(raw[indexKey])
                    }
                })
            }
        })
    },

    render: function(){
        return this.$el
    },

    addRow: function(model){
        var $ul = this.$('ul')
        view = new this.subModule.Class(this.getOptions([{name:'item', type:'model', value:model, extra:'item'}]))
        $ul.append(view.render())
    }
})
