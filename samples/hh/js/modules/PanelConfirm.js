var
Module = require('Module')

me.Class = Module.Class.extend({
    className: 'card',
    title:'',
    options:[],
    initialize: function(options){
        var
        fields = Module.Class.prototype.initialize.call(this, options)

        this.options.length = 0

        for(var f,i=0,l=fields.length; i<l; i++){
            f = fields[i]
            switch(f.type){
            case 'text':
                this.title = f.value
                break
            case 'url':
                this.options.push(f)
                break
            }
        }

        this.$el.html('<ul class="table-view"></ul>')
    },
    render: function(){
        var
        $ul = this.$('ul'),
        options = this.options

        $ul.empty()
        $ul.append('<li class=table-view-cell>'+this.title+'</li>')
        for(var o,i=0,l=options.length; i<l; i++){
            o = options[i]
            $ul.append('<li class=table-view-cell>'+o.name+'<button class="btn btn-'+o.extra+'">Select</button></li>')
        }
        return this.el
    }
})
