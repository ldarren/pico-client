var
route = require('route'),
Panel = require('views/Panel'),
tplControl = require('@html/control.html')

me.Class = Panel.Class.extend({
    controls: [
        {id:'closeWidget', name:'[Close Widget]'},
        {id:'saveWidget', name:'[Save Widget]'},
    ],
    initialize: function(args){
        Panel.Class.prototype.initialize(args)
        var
        self = this,
        m = this.model

        if (m.get('json')){
            this.showWidget()
        }else{
            m.fetch({
                data:{ id: m.id },
                success:function(){
                    self.showWidget()
                }
            })
        }
    },
    events: {
        'click #saveWidget': 'saveWidget',
        'click #closeWidget': 'closeWidget'
    },
    render: function(){
        var $el = this.$el
        this.controls.forEach(function(control){
            $el.prepend(_.template(tplControl.text, control))
        })
        return this.el
    },
    showWidget: function(){
        this.editor.load(this.model.get('json'), 'json')
    },
    saveWidget: function(){
        var m = this.model
        m.save(null, {
            data:{
                id: m.id,
                json: this.editor.read()
            },
            success:function(){
                alert(m.get('name')+' saved')
            }
        })
    },
    closeWidget: function(){
        var
        e = this.editor,
        m = this.model

        if (m.get('json') === e.read() || confirm('Are you sure?')){
            route.instance.navigate('#', {trigger: true})
        }
    }
})
