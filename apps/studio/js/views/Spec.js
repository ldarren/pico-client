var
ModelConstants = require('models/Constants'),
tplItem = require('@html/item.html'),
Panel = require('views/Panel')

exports.Class = Panel.Class.extend({
    initialize: function(args){
        Panel.Class.prototype.initialize.call(this, args)

        var 
        self = this,
        mid = this.model ? this.model.id : null

        ModelConstants.instance.each(function(m){self.addSpec(m)})
        this.collection.each(function(m){if(mid === m.id)return;self.addWidget(m)})
    },
    events:{
        'click .item': 'insertSpec'
    },
    render: function(){
        return this.el
    },
    addSpec: function(model){
        this.$el.append(_.template(tplItem.text, _.extend({className:'spec'},model.attributes)))
    },
    addWidget: function(model){
        this.$el.append(_.template(tplItem.text, _.extend({className:'widget'},model.attributes)))
    },
    insertSpec: function(e){
        var
        isSpec = e.target.classList.contains('spec'),
        coll = isSpec ? ModelConstants.instance : this.collection,
        m = coll.get(e.target.id.substr(1)).attributes

        if (isSpec) this.editor.insert(JSON.stringify(m.json), 'json')
        else this.editor.insert(JSON.stringify({name:m.name, type:'module', value:m.json}), 'json')
    }
})
