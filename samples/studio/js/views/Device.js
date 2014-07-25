var
tpl = require('@html/device.html'),
home = '<div class=deviceContent><input type=url name=url value=URL></input></div>',
iframe = '<iframe src=URL class=deviceContent width=321 height=569 frameBorder=0 seamless=seamless></iframe>'

exports.Class = Backbone.View.extend({
    el: '#device',
    url: '',
    initialize:function(args){
    },
    render:function(){
        this.el.innerHTML = tpl.text
        return this.el
    },
    events:{
        'keyup .deviceContent > input': 'changeView',
        'click .button.back': 'back',
        'click .button.reload': 'reload'
    },
    changeView: function(e){
        if (13 === e.keyCode){
            var url = this.url = e.target.value
            this.$('.deviceContent').replaceWith(iframe.replace('URL', url))
            this.$('.button').removeClass('hidden')
        }
    },
    back: function(e){
        this.$('.deviceContent').replaceWith(home.replace('URL', this.url))
        this.$('.button').addClass('hidden')
    },
    reload: function(e){
        this.$('.deviceContent').replaceWith(iframe.replace('URL', this.url))
    }
})
