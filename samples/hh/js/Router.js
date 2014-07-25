var trigger = {trigger:true}
exports.Class = Backbone.Router.extend({
    nav: function(url){
        this.navigate(url, trigger)
    },
    home: function(){
        this.navigate('', trigger)
    }
})
exports.instance = null
