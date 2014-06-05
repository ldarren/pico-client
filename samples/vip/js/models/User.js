var
KEY = 'vipUser',
defaults = {
    id: undefined,
    follows:[]
};

me.Class = Backbone.Model.extend({

    defaults: window.localStorage[KEY] || defaults,

    initialize: function(){
        this.on('change', function(model, changed){
            window.localStorage[KEY] = model.attributes;
        });
    },

    sync: function(model, data, options){
        if (!model.id) return options.success();
    },

    validate: function(attributes, options){
    }
});
