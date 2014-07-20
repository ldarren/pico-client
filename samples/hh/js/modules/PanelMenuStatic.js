var
Module = require('Module'),
tpl = require('@html/PanelMenuStatic.html')

me.Class = Module.Class.extend({
    initialize: function(options){
        Module.Class.prototype.initialize.call(this,options) 
    },

    render: function(){
        var
        fields = this.spec,
        $el = this.$el

        $el.html('<div class="card"><ul class="table-view"></ul></div>')
        var $ul = $el.find('ul')
        for(var f,i=0,l=fields.length; i<l,f=fields[i]; i++){
            $ul.append(tpl.text.replace('URL', f.value).replace('NAME', f.name))
        }

        return this.$el
    }
})
