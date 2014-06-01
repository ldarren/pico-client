var ModelShop = require('models/shop');

me.slot(pico.LOAD, function(){
    me.Class = Backbone.Collection.extend({
        model: ModelShop.Class,
        parse: function(res){
            return res.all;
        }
    });
});
