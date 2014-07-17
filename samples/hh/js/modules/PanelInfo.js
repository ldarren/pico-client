var
Module = require('Module')

me.Class = Module.Class.extend({
    info:[],
    initialize: function(options){
        var
        fields = Module.Class.prototype.initialize.call(this, options),
        title

        this.info.length = 0

        for(var f,i=0,l=fields.length; i<l; i++){
            f = fields[i]
            switch(f.type){
            case 'text':
                if ('title' === f.name) title = f.value
                else this.info.push(f)
                break
            }
        }

        this.$el.html('<h5 class=content-padded>'+title+'</h5><div class=card><form class=input-group></form></div>')
    },
    render: function(){
        var
        $form = this.$('form'),
        info = this.info

        $form.empty()
        for(var o,i=0,l=info.length; i<l,o=info[i]; i++){
            $form.append('<div class="input-row"><label>'+o.name+'</label><input type="text" value="'+o.value+'" readonly></div>')
        }
        return this.el
    }
})
