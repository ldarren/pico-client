var
Module = require('Module'),
tpl = require('@html/PanelMenuStatic.html')

me.Class = Module.Class.extend({
    template: _.template('<div class="card"><ul class="table-view"></ul></div>'),
    fields: null, 
    initialize: function(options){
        this.fields = Module.Class.prototype.initialize.call(this,options) 
    },

    render: function(){
        var
        fields = this.fields,
        $el = this.$el

        $el.html(this.template({}))
        var $ul = $el.find('ul')
        for(var f,i=0,l=fields.length; i<l; i++){
            f = fields[i]
            $ul.append(tpl.text.replace('URL', f.value).replace('NAME', f.name))
        }

        return this.$el
    }
})
