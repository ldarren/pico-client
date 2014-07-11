var
Panel = require('views/Panel'),
route = require('route'),
tplItem = require('@html/item.html'),
tplControl = require('@html/control.html')

me.Class = Panel.Class.extend({
    controls: [
        {id:'createWidget', name:'[Create Widget]'}
    ],
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
        var $el = this.$el
        this.controls.forEach(function(control){
            $el.prepend(_.template(tplControl.text, control))
        })
        return this.el
    },
    addWidget: function(model, collection){
        this.$el.append(_.template(tplItem.text, model.attributes))
    },
    openWidget: function(e){
        var id = e.target.id

        switch(id){
        case 'createWidget':
            var name = this.editor.read()
            if (!name) return alert('Please enter a name')
            var data = {
                name: name,
                json: {fields:[]}
            }
            this.collection.create(data,{
                wait: true,
                data:data,
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
