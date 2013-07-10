pico.def('camera', 'picBase', function(){
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
        hint, x, y;

        ctx.save();
        ctx.font = 'bold 12pt sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for(var w=0, wl=mapW*mapH; w<wl; w++){
            x = width * Math.floor(w%mapW), y = height * Math.floor(w/mapW);
            if (map[w] & G_TILE_TYPE.HIDE){
                tileSet.draw(ctx, G_FLOOR.UNCLEAR, x, y, width, height);
            }else{
                hint = hints[w];
                tileSet.draw(ctx, G_FLOOR.CLEAR, x, y, width, height);
                if (objects[w]){
                    tileSet.draw(ctx, objects[w], x, y, width, height);
                }else if (hint){
                    ctx.fillStyle = G_HINT_COLOR[Math.floor((hint & 0x0f)*0.5)];
                    ctx.fillText(Math.floor(hint/16), x + hw, y+hh, width);
                }
            }
        }
        tileSet.draw(ctx, this.heroJob, width * Math.floor(heroPos%mapW), height * Math.floor(heroPos/mapW), width, height);
        ctx.restore();
    };
});
