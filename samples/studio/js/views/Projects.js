var
route = require('route'),
tpl = require('@html/projects.html'),
Project = Backbone.View.extend({
    tagName: 'div',
    className: 'project',
    attributes: function(){
        return { id: 'p'+this.model.id }
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

        if (c.length) c.each(function(m){self.addProject(m, c)})
        else c.fetch()

        this.listenTo(c, 'add', this.addProject)

        this.editor = options.editor
    },
    events:{
        'click .project': 'openProject'
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
        if (id){
            route.instance.navigate('project/'+id.substr(1), {trigger:true})
        }else{
            this.collection.create(null,{
                data:{
                    name: this.editor.read(),
                    json: {}
                },
                success: function(collection, data){
                    route.instance.navigate('project/'+data.id, {trigger:true})
                }
            })
        }
    }
})
