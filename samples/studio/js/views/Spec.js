var
ModelConstants = require('models/Constants'),
tplItem = require('@html/item.html'),
Panel = require('views/Panel')

me.Class = Panel.Class.extend({
    initialize: function(args){
        Panel.Class.prototype.initialize.call(this, args)

        var self = this

        ModelConstants.instance.each(function(m){self.addSpec(m)})
        this.collection.each(function(m){self.addSpec(m)})
    },
    events:{
        'click .item': 'insertSpec'
    },
    render: function(){
        return this.el
    },
    addSpec: function(model){
        this.$el.append(_.template(tplItem.text, model.attributes))
    },
    insertSpec: function(e){
        var
        m = this.collection.get(e.target.id.substr(1)).attributes,
        json = m.json
        if (json.length) this.editor.insert(JSON.stringify({name:m.name, type:'module', value:json}), 'json')
        else this.editor.insert(JSON.stringify(json), 'json')
    }
})
