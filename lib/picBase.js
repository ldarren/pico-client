// use picBase for intercomponent sigslot
module.exports = {
    create: function(entity, data){
        return data;
    },

    destroy: function(entity, data){
    },

    show: function(entity, data, evt){
    },

    hide: function(entity, data, evt){
    },

    findHost: function(entities, name){
        if (!entities) return;
        var e;
        for(var i=0, l=entities.length; i<l; i++){
            e = entities[i];
            if (name === e.name) return e;
        }
    },

    findHostByCom: function(entities, name){
        if (!entities) return;
        var e, com;
        for(var i=0, l=entities.length; i<l; i++){
            e = entities[i];
            com = e.getComponent(name);
            if (com) return e;
        }
    }
};
