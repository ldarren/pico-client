var Module = require('Module')

exports.Class = Module.Class.extend({
    initialize: function(options){
        var self = this

        this.init(options, function(err, spec){
            for(var s,i=0; s=spec[i]; i++){
                switch(s.type){
                case 'select': self.select = s; break
                }
            }
            self.$el.html('<h5 class=content-padded>'+self.select.name+'</h5><div class=card><form class=input-group></form></div>')
            self.triggerHost('invalidate')
        })
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
