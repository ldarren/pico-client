var
Module = require('Module')

exports.Class = Module.Class.extend({
    className: 'card',
    create: function(spec){
        this.$el.html('<ul class="table-view"></ul>')
        this.select = this.requireType('select')
        this.triggerHost('invalidate')
    },
    render: function(){
        var
        $ul = this.$('ul'),
        s = this.select,
        options = s.value

        $ul.empty()
        $ul.append('<li class=table-view-divider>'+s.name+'</li>')
        for(var o,i=0; o=options[i]; i++){
            $ul.append('<li class=table-view-cell>'+o.value+'<button class="btn btn-'+o.type+'">Select</button></li>')
        }
        return this.el
    }
})
