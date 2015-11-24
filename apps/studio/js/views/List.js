var
Panel = require('views/Panel'),
route = require('route'),
tplItem = require('@html/item.html'),
tplIcon = require('@html/icon.html'),
tplControl = require('@html/control.html'),
projectJSON = {routes:{},pages:{},spec:[{name:'projURL',type:'url',value:''}],deps:[],styles:[]},
widgetJSON = []

exports.Class = Panel.Class.extend({
    initialize: function(args){
        Panel.Class.prototype.initialize.call(this, args)

        this.itemType = args.itemType
        this.controls = [{id:'createItem', name:'[Create '+args.itemType+']'}]

        var
        self = this,
        c = this.collection

        if (c.length) c.each(function(m){self.addItem(m, c)})
        else c.fetch()

        this.listenTo(c, 'add', this.addItem)
        this.listenTo(c, 'change', this.renameItem)
        this.listenTo(c, 'destroy', this.removeItem)
    },
    events:{
        'click .item': 'openItem',
        'click .rightBar .icon': 'doOptions'
    },
    render: function(){
        var $el = this.$el
        this.controls.forEach(function(control){
            $el.prepend(_.template(tplControl.text, control))
        })
        return this.el
    },
    addItem: function(model, collection){
        this.$el.append(_.template(tplItem.text, model.attributes))
        this.$el.children().last().find('.rightBar').append(_.template(tplIcon.text, {icon:'edit'})).append(_.template(tplIcon.text, {icon:'minus'}))
    },
    renameItem: function(model){
        this.$('#i'+model.id).text(model.get('name'))
    },
    removeItem: function(model){
        this.$('#i'+model.id).parent().remove()
    },
    openItem: function(e){
        var
        self = this,
        id = e.target.id

        switch(id){
        case 'createItem':
            var name = this.editor.read()
            if (!name) return alert('Please enter a name')
            var data = {
                name: name,
                json: 'project' === self.itemType ? projectJSON : widgetJSON
            }
            this.collection.create(data,{
                wait: true,
                data:data,
                success: function(collection, data){
                    route.instance.navigate(self.itemType+'/'+data.id, {trigger:true})
                }
            })
            break
        default:
            route.instance.navigate(self.itemType+'/'+id.substr(1), {trigger:true})
            break
        }
    },
    doOptions: function(e){
        var
        itemId = e.target.parentNode.parentNode.getElementsByTagName('span')[1].textContent,
        list = e.target.classList,
        model = this.collection.findWhere({name:itemId})

        if (!model) return

        if (list.contains('icon-edit')){
            var name = prompt('Enter a new name', itemId)
            if (!name || name === itemId) return
            var data={id:model.id,name:name}
            model.save(data,{ data:data, wait:true })
        }else if (list.contains('icon-minus')){
            if (confirm('Remove item "'+itemId+'"?')){
                var data = {id:model.id}
                model.destroy({ data:data })
            }
        }
    }
})
