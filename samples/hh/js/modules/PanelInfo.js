var
Module = require('Module')

me.Class = Module.Class.extend({
    initialize: function(options){
        var
        fields = Module.Class.prototype.initialize.call(this, options),
        info = [],
        title

        for(var f,i=0,l=fields.length; i<l; i++){
            f = fields[i]
            switch(f.type){
            case 'text':
                if ('title' === f.name) title = f.value
                else info.push(f)
                break
            }
        }

        this.info = info

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
