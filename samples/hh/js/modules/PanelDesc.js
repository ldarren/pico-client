var
Module = require('Module')

me.Class = Module.Class.extend({
    initialize: function(options){
        var
        fields = Module.Class.prototype.initialize.call(this, options),
        info = [],
        title

        for(var f,i=0,l=fields.length; i<l,f=fields[i]; i++){
            switch(f.type){
            case 'text':
                if ('title' === f.name) title = f.value
                else info.push(f)
                break
            }
        }
        this.info = info
        this.$el.html('<h5 class=content-padded>'+title+'</h5><div class=card><ul class=table-view></ul></div>')
    },
    render: function(){
        var
        $ul = this.$('ul'),
        info = this.info

        $ul.empty()
        for(var o,i=0,l=info.length; i<l,o=info[i]; i++){
            $ul.append('<li class=table-view-cell>'+o.value+'</li>')
        }
        return this.el
    }
})
