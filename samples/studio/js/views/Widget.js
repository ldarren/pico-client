var
Panel = require('views/Panel'),
tpl = require('@html/widget.html')

me.Class = Panel.Class.extend({
    initialize: function(args){
        Panel.Class.prototype.initialize(args)
        var
        self = this,
        m = this.model

        this.el.innerHTML = tpl.text

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
        'click #saveWidget': 'saveWidget'
    },
    render: function(){
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
    }
})
