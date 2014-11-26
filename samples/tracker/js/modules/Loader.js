var
Module = require('Module'),
network = require('network'),
tpl = require('@html/Loader.html'),
onSend= function(url){
    if (-1 !== url.indexOf('tr/data/poll')) return
    this.el.classList.remove('hidden')
},
onRecv= function(url){
    if (-1 !== url.indexOf('tr/data/poll')) return
    this.el.classList.add('hidden')
}

exports.Class = Module.Class.extend({
    className: 'modal-widget hidden',
    create: function(spec){
        this.$el.html(tpl.text)

        network.slot('send', onSend, this)
        network.slot('recv', onRecv, this)
        network.slot('error', onRecv, this)

        this.triggerHost('invalidate')
    }
})
