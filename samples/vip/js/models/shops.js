var ModelShop = require('models/shop');

me.Class = Backbone.Collection.extend({
    model: ModelShop.Class,
    parse: function(res){
        return res.all;
    }
});
