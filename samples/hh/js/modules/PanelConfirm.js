var
Module = require('Module')

me.Class = Module.Class.extend({
    className: 'card',
    initialize: function(options){
        var
        fields = Module.Class.prototype.initialize.call(this, options),
        op = []

        for(var f,i=0,l=fields.length; i<l,f=fields[i]; i++){
            switch(f.type){
            case 'text':
                this.title = f.value
                break
            case 'url':
                op.push(f)
                break
            }
        }
        this.options = op

        this.$el.html('<ul class="table-view"></ul>')
    },
    render: function(){
        var
        $ul = this.$('ul'),
        options = this.options

        $ul.empty()
        $ul.append('<li class=table-view-divider>'+this.title+'</li>')
        for(var o,i=0,l=options.length; i<l,o=options[i]; i++){
            $ul.append('<li class=table-view-cell>'+o.name+'<button class="btn btn-'+o.extra+'">Select</button></li>')
        }
        return this.el
    }
})
