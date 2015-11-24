var
route = require('route'),
Panel = require('views/Panel'),
tplControl = require('@html/control.html')

exports.Class = Panel.Class.extend({
    controls: [
        {id:'closeWidget', name:'[Close Widget]'},
        {id:'saveWidget', name:'[Save Widget]'},
    ],
    initialize: function(args){
        Panel.Class.prototype.initialize.call(this, args)
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
        this.editor.write(JSON.stringify(this.model.get('json'), null, 4), 'json')
    },
    saveWidget: function(){
        try{
            var
            m = this.model,
            data = {
                id: m.id,
                json: JSON.parse(this.editor.read())
            }
        }catch(ex){
            alert('invalid json: '+ex.message)
            return
        }

        m.save(data, {
            data:data,
            success:function(){
                alert(m.get('name')+' saved')
            }
        })
    },
    closeWidget: function(){
        if (confirm('Are you sure?')){
            route.instance.navigate('', {trigger: true})
        }
    }
})
