var
Panel = require('views/Panel'),
route = require('route'),
tplItem = require('@html/item.html'),
tplControl = require('@html/control.html')

me.Class = Panel.Class.extend({
    editMode: true,
    controls: [
        {id:'createWidget', name:'[Create Widget]'}
    ],
    initialize: function(args){
        this.reinit(null, args)

        this.listenTo(this.collection, 'add', this.addWidget)
    },
    events:{
        'click .item': 'selectWidget',
        'reinit': 'reinit'
    },
    reinit: function(evt, args){
        Panel.Class.prototype.initialize(args)
        this.editMode = 'edit' === args.mode

        var
        self = this,
        c = this.collection = args.collection,
        $el = this.$el

        $el.empty()

        if (this.editMode){
            this.controls.forEach(function(control){
                $el.prepend(_.template(tplControl.text, control))
            })
        }

        if (c.length) c.each(function(m){self.addWidget(m, c)})
        else c.fetch()
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
                json: {fields:[]}
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
            if (this.editMode){
                route.instance.navigate('widget/'+id.substr(1), {trigger:true})
            }else{
                var m = this.collection.get(id.substr(1)).attributes
                this.editor.insert(JSON.stringify({id:m.id, name:m.name, fields:m.json.fields}), 'json')
            }
            break
        }
    }
})
