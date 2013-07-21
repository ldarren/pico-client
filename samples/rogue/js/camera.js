pico.def('camera', 'picBase', function(){
    var
    me = this,
    name = me.moduleName,
    ctrX=0, ctrY=0,
    screenshotX=0, screenshotY=0;

    me.resize = function(elapsed, evt, entities){
        ctrX = evt[0] + (evt[2] - this.mapWidth * this.tileWidth)/2;
        ctrY = evt[1] + (evt[3] - this.mapHeight * this.tileHeight)/2;
        return entities;
    };

    me.checkBound = function(elapsed, evt, entities){
        var
        x = evt[0], y = evt[1],
        mapW = this.mapWidth,
        mapH = this.mapHeight,
        tileW = this.tileWidth,
        tileH = this.tileHeight,
        unknowns = [],
        e, opt;

        for (var i=0, l=entities.length; i<l; i++){
            e = entities[i];
            opt = e.getComponent(name);
            if (!opt) {
                unknowns.push(e);
                continue;
            }
            if (x > ctrX && y > ctrY && x < ctrX + mapW*tileW && y < ctrY + mapH*tileH)
                return [e];
        }

        return unknowns;
    };

    me.click = function(elapsed, evt, entities){
        var
        e = entities[0],
        com = e.getComponent(name);

        if (!com) return entities;

        var
        map = this.map,
        mapW = this.mapWidth,
        mapH = this.mapHeight,
        tileW = this.tileWidth,
        tileH = this.tileHeight,
        x = Math.floor((evt[0] - ctrX) / tileW),
        y = Math.floor((evt[1] - ctrY) / tileH),
        id, tileType;

        if (y > mapH || x > mapW) return;
        id = mapW * y + x;
        tileType = map[id];

        if (tileType & G_TILE_TYPE.HIDE) {
            if (this.activatedSkill){
                this.flags[id] = true;
            }else{
                this.fillTiles(id);
                this.flags[id] = undefined;
            }
        }

        tileType = map[id];
        if (!(tileType & G_TILE_TYPE.HIDE)){
            if(tileType & G_TILE_TYPE.CREEP) this.go('showInfo', {creepId:this.objects[id]});
            else this.go('hideInfo');

            if(tileType & G_TILE_TYPE.STAIR_DOWN){
                this.go('checkResult');
            }
        }

        return entities;
    };

    me.swipe = function(elapsed, evt, entities){
        var
        e = entities[0],
        com = e.getComponent(name);

        if (!com) return entities;

        ctrX += evt[0] - evt[2];
        ctrY += evt[1] - evt[3];

        return entities;
    };

    me.draw = function(ctx, ent, clip){
        var
        tileSet = this.tileSet,
        map = this.map,
        mapW = this.mapWidth,
        mapH = this.mapHeight,
        objects = this.objects,
        flags = this.flags,
        hints = this.hints,
        heroPos = this.heroPos,
        width = this.tileWidth,
        height = this.tileHeight,
        hw = Math.floor(width/2),
        hh = Math.floor(height/2),
        screenshotX = ctrX,
        screenshotY = ctrY,
        hint, x, y, objectId, tileId;

        ctx.save();
        ctx.font = 'bold 12pt sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for(var w=0, wl=mapW*mapH; w<wl; w++){
            x = ctrX + width * Math.floor(w%mapW), y = ctrY + height * Math.floor(w/mapW);
            tileId = map[w];
            if (tileId & G_TILE_TYPE.HIDE){
                tileSet.draw(ctx, G_FLOOR.UNCLEAR, x, y, width, height);
                if (flags[w]) tileSet.draw(ctx, G_MARK.EYE_OF_GOD, x, y, width, height);
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
        x = ctrX + width * Math.floor(heroPos%mapW);
        y = ctrY + height * Math.floor(heroPos/mapW);
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

    me.drawScreenshot = function(ctx, ent, clip, bitmap){
        ctx.save();
        ctx.drawImage(bitmap, ctrX-screenshotX, ctrY-screenshotY);
        ctx.restore();
    };
});
