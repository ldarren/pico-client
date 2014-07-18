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
        Panel.Class.prototype.initialize.call(this, args)

        var
        self = this,
        c = this.collection = args.collection,
        $el = this.$el

        $el.empty()

        this.controls.forEach(function(control){
            $el.prepend(_.template(tplControl.text, control))
        })

        this.listenTo(this.collection, 'add', this.addWidget)

        if (c.length) c.each(function(m){self.addWidget(m, c)})
        else c.fetch()
    },
    events:{
        'click .item': 'selectWidget',
    },
    reinit: function(evt, args){
    },
    render: function(){
        return this.el
    },
    addWidget: function(model, collection){
        this.$el.append(_.template(tplItem.text, model.attributes))
    },
    selectWidget: function(e){
        var id = e.target.id

        switch(id){
        case 'createWidget':
            var name = this.editor.read()
            if (!name) return alert('Please enter a name')
            var data = {
                name: name,
                json: []
            }
            this.collection.create(data,{
                wait: true,
                data:data,
                success: function(collection, res){
                    route.instance.navigate('widget/'+res.id, {trigger:true})
                }
            })
            break
        default:
            route.instance.navigate('widget/'+id.substr(1), {trigger:true})
            break
        }
    }
})
