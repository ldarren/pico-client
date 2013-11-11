pico.def('effect', 'picBase', function(){
    var me = this;

    me.draw = function(ctx, ent, clip){
    };

    // remove ui for screenshot
    me.prepare = function(elpased, evt, entities){
        return entities;
    };

    // add effectEnt, start do Effect loop
    me.start = function(elpased, evt, entities){
        return entities;
    };

    // put back ui, hide effect entity
    me.stop = function(elpased, evt, entities){
        return entities;
    };
});
