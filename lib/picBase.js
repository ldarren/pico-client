// use picBase for intercomponent sigslot
me.create = function(entity, data){
    return data;
};

me.destroy = function(entity, data){
};

me.show = function(entity, data, evt){
};

me.hide = function(entity, data, evt){
};

me.findHost = function(entities, name){
    if (!entities) return;
    var e;
    for(var i=0, l=entities.length; i<l; i++){
        e = entities[i];
        if (name === e.name) return e;
    }
};

me.findHostByCom = function(entities, name){
    if (!entities) return;
    var e, com;
    for(var i=0, l=entities.length; i<l; i++){
        e = entities[i];
        com = e.getComponent(name);
        if (com) return e;
    }
};
