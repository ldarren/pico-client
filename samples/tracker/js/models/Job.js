me.Class = Backbone.Model.extend({
    parse: function(res){
        return res.me ? res.me : res
    }
})
