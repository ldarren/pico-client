var
tplItem = require('@html/item.html'),
Panel = require('views/Panel')

me.Class = Panel.Class.extend({
    initialize: function(args){
        Panel.Class.prototype.initialize(args)

        var
        self = this,
        c = this.collection

        if (c.length) c.each(function(m){self.addField(m, c)})
        else c.fetch()

        this.listenTo(c, 'add', this.addField)
    },
    events:{
        'click .item': 'insertField'
    },
    render: function(){
        return this.el
    },
    addField: function(model, collection){
        this.$el.append(_.template(tplItem.text, model.attributes))
    },
    insertField: function(e){
        var m = this.collection.get(e.target.id.substr(1))

        this.editor.insert(JSON.stringify(m.get('json'), null, 4))
    }
})
