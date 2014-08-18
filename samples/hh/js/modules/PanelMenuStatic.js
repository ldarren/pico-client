var
Module = require('Module'),
tpl = require('@html/PanelMenuStatic.html')

exports.Class = Module.Class.extend({
    className: 'card',
    initialize: function(options){
        this.$el.html('<ul class="table-view"></ul>')
        var self = this
        this.init(options, function(err, spec){
            var $ul = self.$el.find('ul')

            for(var f,i=0; f=spec[i]; i++){
                $ul.append(tpl.text.replace('URL', f.value).replace('NAME', f.name))
            }
            self.triggerHost('invalidate')
        })
    },

    render: function(){
        return this.$el
    }
})
