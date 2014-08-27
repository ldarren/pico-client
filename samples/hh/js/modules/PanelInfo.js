var Module = require('Module')

exports.Class = Module.Class.extend({
    create: function(spec){
        this.select = this.requireType('select')
        this.$el.html('<h5 class=content-padded>'+this.select.name+'</h5><div class=card><form class=input-group></form></div>')
        this.triggerHost('invalidate')
    },
    render: function(){
        var
        $form = this.$('form'),
        info = this.select.value

        $form.empty()
        for(var o,i=0; o=info[i]; i++){
            $form.append('<div class="input-row"><label>'+o.name+'</label><input type="text" value="'+o.value+'" readonly></div>')
        }
        return this.el
    }
})
