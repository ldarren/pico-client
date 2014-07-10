var
tpl = require('@html/device.html')

me.Class = Backbone.View.extend({
    el: '#device',
    initialize:function(args){
    },
    render:function(){
        this.el.innerHTML = tpl.text
        return this.el
    },
    events:{
        'keyup .deviceContent > input': 'changeView'
    },
    changeView: function(e){
        if (13 === e.keyCode){
            var url = e.target.value
            this.$el.html('<iframe src='+url+' class=deviceContent width=321 height=569 frameBorder=0 seamless=seamless></iframe>')
        }
    }
})
