pico.def('camera', 'picUIWindow', function(){
    var
    me = this,
    name = me.moduleName;

    me.resize = function(elapsed, evt, entities){
        return entities;
    };

    me.draw = function(ctx, ent, elapsed){
        var
        tileSet = this.tileSet,
        map = this.map,
        mapW = this.mapWidth,
        mapH = this.mapHeight,
        objects = this.objects,
        hints = this.hints,
        heroPos = this.heroPos,
        width = this.tileWidth,
        height = this.tileHeight,
        hw = Math.floor(width/2),
        hh = Math.floor(height/2),
        hint, x, y, objectId, tileId;

        ctx.save();
        ctx.font = 'bold 12pt sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for(var w=0, wl=mapW*mapH; w<wl; w++){
            x = width * Math.floor(w%mapW), y = height * Math.floor(w/mapW);
            tileId = map[w];
            if (tileId & G_TILE_TYPE.HIDE){
                tileSet.draw(ctx, G_FLOOR.UNCLEAR, x, y, width, height);
            }else{
                hint = hints[w];
                objectId = objects[w];
                tileSet.draw(ctx, G_FLOOR.CLEAR, x, y, width, height);
                if (objectId){
                    tileSet.draw(ctx, objectId, x, y, width, height);
                    if (hint && tileId & G_TILE_TYPE.STAIR_UP){
                        ctx.fillStyle = G_HINT_COLOR[Math.floor((hint & 0x0f)*0.5)];
                        ctx.fillText(Math.floor(hint/16), x+hw, y+hh, width);
                    }
                }else if (hint){
                    ctx.fillStyle = G_HINT_COLOR[Math.floor((hint & 0x0f)*0.5)];
                    ctx.fillText(Math.floor(hint/16), x+hw, y+hh, width);
                }
            }
        }
        x = width * Math.floor(heroPos%mapW);
        y = height * Math.floor(heroPos/mapW);
        tileSet.draw(ctx, this.heroJob, x, y, width, height);
        hint = hints[heroPos];
        if (hint){
            ctx.textAlign = 'right';
            ctx.textBaseline = 'bottom';
            ctx.fillStyle = G_HINT_COLOR[Math.floor((hint & 0x0f)*0.5)];
            ctx.fillText(Math.floor(hint/16), x+width, y+height, width);
        }
        ctx.restore();
    };
});
