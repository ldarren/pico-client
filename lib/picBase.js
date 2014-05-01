// use picBase for intercomponent sigslot
pico.def(function(){

    this.create = function(entity, data){
        return data;
    };

    this.destroy = function(entity, data){
    };

    this.show = function(entity, data, evt){
    };

    this.hide = function(entity, data, evt){
    };

    this.findHost = function(entities, name){
        if (!entities) return;
        var e;
        for(var i=0, l=entities.length; i<l; i++){
            e = entities[i];
            if (name === e.name) return e;
        }
    };

    this.findHostByCom = function(entities, name){
        if (!entities) return;
        var e, com;
        for(var i=0, l=entities.length; i<l; i++){
            e = entities[i];
            com = e.getComponent(name);
            if (com) return e;
        }
    };
});
