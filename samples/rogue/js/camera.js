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
        heroPos = game.heroPos,
        width = game.tileWidth,
        height = game.tileHeight,
        x = 0,
        y = 0,
        row,
        w, wl, h, hl;

        ctx.save();
        for(h=0, hl=game.mapHeight; h<hl; h++){
            row = map[h];
            x = 0;
            for(w=0, wl=game.mapWidth; w<wl; w++){
                tileSet.draw(ctx, row[w], x, y, width, height);
                x += width;
            }
            y += height;
        }
        tileSet.draw(ctx, game.heroJob, heroPos[0]*width, heroPos[1]*height, width, height);
        ctx.restore();
    };
});
