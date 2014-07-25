var
trigger = {trigger:true},
inst

exports.Class = Backbone.Router.extend({
    initialize: function(){
        inst = this
    },
    nav: function(url){
        this.navigate(url, trigger)
    },
    home: function(){
        this.navigate('', trigger)
    }
})
exports.instance = function(){return inst}
Object.freeze(exports)
