pico.def('uiPlayer', 'picBase', function(){
    var
    me = this,
    name = me.moduleName;

    me.resize = function(elapsed, evt, entities){
        return entities;
    };

    me.draw = function(ctx, ent, clip){
        var o = ent.getComponent(name);
        if (!o) return;

        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = 'rgba(172, 152, 102, 1)';
        ctx.fillRect(clip[0], clip[1], clip[2], clip[3]);
        ctx.restore();
    };
});
