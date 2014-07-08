var
route = require('route'),
tpl = require('@html/widgets.html'),
Widget = Backbone.View.extend({
    tagName: 'div',
    className: 'widget',
    attributes: function(){
        return { id: 'w'+this.model.id }
    },
    render: function(){
        this.el.textContent = this.model.get('name')
        return this.el
    }
})

me.Class = Backbone.View.extend({
    editor: null,
    initialize: function(options){
        var
        self = this,
        c = options.collection

        if (c.length) c.each(function(m){self.addWidget(m, c)})
        else c.fetch()

        this.listenTo(c, 'add', this.addWidget)

        this.editor = options.editor
    },
    events:{
        'click .widget': 'openWidget'
    },
    render: function(){
        this.el.innerHTML = tpl.text
        return this.el
    },
    addWidget: function(model, collection){
        this.$el.append((new Widget.Class({model:model})).render())
    },
    openWidget: function(e){
        var id = e.target.id
        if (id){
            route.instance.navigate('widget/'+id.substr(1), {trigger:true})
        }else{
            this.collection.create(null,{
                data:{
                    name: this.editor.read(),
                    json: {}
                },
                success: function(collection, data){
                    route.instance.navigate('widget/'+data.id, {trigger:true})
                }
            })
        }
    }
})
