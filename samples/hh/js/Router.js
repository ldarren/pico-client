var trigger = {trigger:true}
me.Class = Backbone.Router.extend({
    nav: function(url){
        this.navigate(url, trigger)
    },
    home: function(){
        this.navigate('', trigger)
    }
})
me.instance = null
