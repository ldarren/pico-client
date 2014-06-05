var Company = require('models/Company');

me.slot(pico.LOAD, function(){
    me.Class = Backbone.Collection.extend({
        model: Company.Class,
        parse: function(res){
            return res.list;
        }
    });
});
