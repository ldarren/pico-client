var
Panel = require('views/Panel'),
route = require('route'),
tplItem = require('@html/item.html'),
tplControl = require('@html/control.html')

me.Class = Panel.Class.extend({
    controls: [
        {id:'createProject', name:'[Create Project]'}
    ],
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
        var $el = this.$el
        this.controls.forEach(function(control){
            $el.prepend(_.template(tplControl.text, control))
        })
        return this.el
    },
    addProject: function(model, collection){
        this.$el.append(_.template(tplItem.text, model.attributes))
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
