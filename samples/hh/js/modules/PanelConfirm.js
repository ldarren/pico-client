var
Module = require('Module')

me.Class = Module.Class.extend({
    className: 'card',
    initialize: function(options){
        this.$el.html('<ul class="table-view"></ul>')
        var self = this

        Module.Class.prototype.initialize.call(this, options, function(err, spec){
            for(var s,i=0,l=spec.length; i<l,s=spec[i]; i++){
                switch(s.type){
                case 'select':
                    self.select = s
                    break
                }
            }
            self.invalidate()
        })
    },
    render: function(){
        var
        $ul = this.$('ul'),
        s = this.select,
        options = s.value

        $ul.empty()
        $ul.append('<li class=table-view-divider>'+s.name+'</li>')
        for(var o,i=0,l=options.length; i<l,o=options[i]; i++){
            $ul.append('<li class=table-view-cell>'+o.value+'<button class="btn btn-'+o.type+'">Select</button></li>')
        }
        return this.el
    }
})
