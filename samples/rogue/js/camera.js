pico.def('camera', 'picBase', function(){
    var
    me = this,
    name = me.moduleName;

    me.create = function(ent, data){
        data.worldObj = pico.getModule(data.world);
        return data;
    };

    me.resize = function(elapsed, evt, entities){
        return entities;
    };

    me.draw = function(ctx, ent, elapsed){
        var o = ent.getComponent(name);
        if (!o) return;

        var
        game = o.worldObj,
        tileSet = game.tileSet,
        map = game.map,
        mapW = game.mapWidth,
        mapH = game.mapHeight,
        objects = game.objects,
        heroPos = game.heroPos,
        width = game.tileWidth,
        height = game.tileHeight,
        w, wl;

        ctx.save();
        for(w=0, wl=mapW*mapH; w<wl; w++){
            if (map[w] & G_TILE_TYPE.HIDE)
                tileSet.draw(ctx, G_FLOOR.CLEAR, 32 * w%mapW, 32 * w/mapW, width, height);
            else
                tileSet.draw(ctx, game.objects[w], 32 * w%mapW, 32 * w/mapW, width, height);
        }
        tileSet.draw(ctx, game.heroJob, 32 * heroPos%mapW, 32 * heroPos/mapW, width, height);
        ctx.restore();
    };
});
