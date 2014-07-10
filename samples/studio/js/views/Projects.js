var
Panel = require('views/Panel'),
route = require('route'),
tpl = require('@html/projects.html'),
Project = Backbone.View.extend({
    tagName: 'div',
    className: 'item',
    attributes: function(){
        return { id: 'p'+this.model.id }
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
        c = this.collection

        if (c.length) c.each(function(m){self.addProject(m, c)})
        else c.fetch()

        this.listenTo(c, 'add', this.addProject)
    },
    events:{
        'click .item': 'openProject'
    },
    render: function(){
        this.el.innerHTML = tpl.text
        return this.el
    },
    addProject: function(model, collection){
        this.$el.append((new Project({model:model})).render())
    },
    openProject: function(e){
        var id = e.target.id

        switch(id){
        case 'createProject':
            var name = this.editor.read()
            if (!name) return alert('Please enter a name')
            this.collection.create(null,{
                wait: true,
                data:{
                    name: name,
                    json: {}
                },
                success: function(collection, data){
                    route.instance.navigate('project/'+data.id, {trigger:true})
                }
            })
            break
        default:
            route.instance.navigate('project/'+id.substr(1), {trigger:true})
            break
        }
    }
})
