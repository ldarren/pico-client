var Module = require('Module')

exports.Class = Module.Class.extend({
    create: function(spec){
        this.select = this.requireType('select')
        this.$el.html('<h5 class=content-padded>'+this.select.name+'</h5><div class=card><ul class=table-view></ul></div>')
        this.triggerHost('invalidate')
    },
    render: function(){
        var
        $ul = this.$('ul'),
        info = this.select.value

        $ul.empty()
        for(var o,i=0; o=info[i]; i++){
            $ul.append('<li class=table-view-cell>'+o+'</li>')
        }
        return this.el
    }
})
