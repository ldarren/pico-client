var
trigger = {trigger:true},
inst

exports.Class = Backbone.Router.extend({
    initialize: function(){
        inst = this
    },
    nav: function(url){
        setTimeout(function(context){
            context.navigate(url, trigger)
        }, 0, this)
    },
    home: function(){
        this.nav('')
    }
})
exports.instance = function(){return inst}
Object.freeze(exports)
