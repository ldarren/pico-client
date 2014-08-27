var
Module = require('Module'),
tpl = require('@html/PanelMenuStatic.html')

exports.Class = Module.Class.extend({
    className: 'card',
    create: function(spec){
        this.$el.html('<ul class="table-view"></ul>')
        var $ul = this.$el.find('ul')

        for(var f,i=0; f=spec[i]; i++){
            $ul.append(tpl.text.replace('URL', f.value).replace('NAME', f.name))
        }
        this.triggerHost('invalidate')
    }
})
