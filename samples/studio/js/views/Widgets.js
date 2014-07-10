var
Panel = require('views/Panel'),
route = require('route'),
tpl = require('@html/widgets.html'),
Widget = Backbone.View.extend({
    tagName: 'div',
    className: 'item',
    attributes: function(){
        return { id: 'w'+this.model.id }
    },
    render: function(){
        this.el.textContent = this.model.get('name')
        return this.el
    }
})

me.Class = Panel.Class.extend({
    initialize: function(args){
        Panel.Class.prototype.initialize(args)
        var
        self = this,
        c = args.collection

        if (c.length) c.each(function(m){self.addWidget(m, c)})
        else c.fetch()

        this.listenTo(c, 'add', this.addWidget)
    },
    events:{
        'click .item': 'openWidget'
    },
    render: function(){
        this.el.innerHTML = tpl.text
        return this.el
    },
    addWidget: function(model, collection){
        this.$el.append((new Widget({model:model})).render())
    },
    openWidget: function(e){
        var id = e.target.id

        switch(id){
        case 'createWidget':
            var name = this.editor.read()
            if (!name) return alert('Please enter a name')
            this.collection.create(null,{
                wait: true,
                data:{
                    name: name,
                    json: {}
                },
                success: function(collection, data){
                    route.instance.navigate('widget/'+data.id, {trigger:true})
                }
            })
            break
        default:
            route.instance.navigate('widget/'+id.substr(1), {trigger:true})
            break
        }
    }
})
