var tpl = require('@html/widget.html')

me.Class = Backbone.View.extend({
    editor: null,
    initialize: function(args){
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

        this.editor = args.editor
    },
    events: {
        'click #saveWidget': 'saveWidget'
    },
    render: function(){
        return this.el
    },
    showWidget: function(){
        var w = JSON.parse(this.model.get('json'))
        
        this.editor.load(w, 'json')
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
