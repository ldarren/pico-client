var Module = require('Module')

exports.Class = Module.Class.extend({
    initialize: function(options){
        var self = this

        this.init(options, function(err, spec){
            for(var s,i=0,l=spec.length; i<l,s=spec[i]; i++){
                switch(s.type){
                case 'select': self.select = s; break
                }
            }
            self.$el.html('<h5 class=content-padded>'+self.select.name+'</h5><div class=card><ul class=table-view></ul></div>')
            self.invalidate()
        })
    },
    render: function(){
        var
        $ul = this.$('ul'),
        info = this.select.value

        $ul.empty()
        for(var o,i=0,l=info.length; i<l,o=info[i]; i++){
            $ul.append('<li class=table-view-cell>'+o+'</li>')
        }
        return this.el
    }
})
