pico.def('camera', 'picBase', function(){
    var
    me = this,
    UNCLEAR = G_FLOOR.UNCLEAR,
    STONE = G_FLOOR.STONE,
    Floor = Math.floor,
    Ceil = Math.ceil,
    name = me.moduleName,
    screenshotX=screenshotY=0,
    camX, camY, camWidth, camHeight,
    viewX,viewY,viewWidth,viewHeight,viewStart,viewWrap,
    calculateView = function(mapWidth, mapHeight, tileWidth, tileHeight){
        var
        mapW = mapWidth * tileWidth, mapH = mapHeight * tileHeight,
        viewTop, viewLeft, viewBottom, viewRight;

        do{
            if (undefined === viewX || viewHeight <= 0 || viewWidth <= 0){
                // center view if it is undefined
                viewX = camX + (camWidth - mapW)/2;
                viewY = camY + (camHeight - mapH)/2;
            }

            viewTop = viewY > camY ? viewY : camY;
            viewLeft = viewX > camX ? viewX : camX;
            viewBottom = viewY+mapH < camY+camHeight ? viewY+mapH : camY+camHeight;
            viewRight = viewX+mapW < camX+camWidth ? viewX+mapW : camX+camWidth;

            viewTop = Floor((viewTop-viewY)/tileHeight);
            viewLeft = Floor((viewLeft-viewX)/tileWidth);
            viewBottom = Ceil((viewBottom-viewY)/tileHeight);
            viewRight = Ceil((viewRight-viewX)/tileWidth);

            viewStart = (viewTop*mapWidth) + viewLeft;
            viewWidth = viewRight - viewLeft;
            viewHeight = viewBottom - viewTop;
            viewWrap = mapWidth - viewWidth;
        }while(viewHeight <= 0 || viewWidth <= 0);
    };

    me.resize = function(elapsed, evt, entities){
        camX = evt[0];
        camY = evt[1];
        camWidth = evt[2];
        camHeight = evt[3];
        calculateView(this.mapWidth, this.mapHeight, this.tileWidth, this.tileHeight);
        screenshotX=viewX, screenshotY=viewY;
        return entities;
    };

    me.checkBound = function(elapsed, evt, entities){
        var
        x = evt[0], y = evt[1],
        tw = this.tileWidth,
        th = this.tileHeight,
        vx = viewX + (viewStart % this.mapWidth)*tw,
        vy = viewY + Floor(viewStart / this.mapWidth)*tw,
        vw = viewWidth*tw,
        vh = viewHeight*th,
        unknowns = [],
        e, opt;

        for (var i=0, l=entities.length; i<l; i++){
            e = entities[i];
            opt = e.getComponent(name);
            if (!opt) {
                unknowns.push(e);
                continue;
            }
            if (x > vx && y > vy && x < vx+vw && y < vy+vh)
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
        x = Floor((evt[0] - viewX) / this.tileWidth),
        y = Floor((evt[1] - viewY) / this.tileHeight),
        hero = this.hero,
        objects = this.objects,
        flags = this.flags,
        hp = hero.getPosition(),
        id, tileType, object, steps;

        if (y > mapH || x > mapW) return entities;
        id = mapW * y + x;
        tileType = map[id];
        object = objects[id];

        if (tileType & G_TILE_TYPE.HIDE){
            if (this.nearToHero(id)) {
                var effect = hero.castSpell();
                if (effect){
                    if (!object){
                        map[id] |= G_TILE_TYPE.CREEP;
                        objects[id] = this.ai.spawnCreep(this.deepestLevel);
                        this.recalHints();

                        this.go('attack', hero.battle(id, true));
                    }else{
                        flags[id] = effect;
                        this.go('showInfo', id);
                    }
                    map[id] &= G_TILE_TYPE.SHOW;
                    this.go('forceRefresh'); // TODO: find a better way to show cooldown counter
                }else{
                    this.go('gameStep', this.fillTiles(id));

                    if (tileType & G_TILE_TYPE.CREEP){
                        this.go('attack', hero.battle(id, true));
                    }
                }
            }else{
                var h = this.findPath(hp, this.nextTile(id, hp));
                if (h.length){
                    this.stopLoop('heroMove');
                    this.startLoop('heroMove', h);
                }
            }
        }else if(object){

            if (hero.equal(object)){
                steps = this.solve(hp);
                if (!steps) return entities;
                this.go('gameStep', steps);
            }else{
                this.go('showInfo', id);
                this.go('gameStep', 1);
            }
        }

        tileType = map[id]; // last action might hv updated tileType
        object = objects[id];
        if (!(tileType & G_TILE_TYPE.HIDE) && !object){
            var h = this.findPath(hp, id);
            if (h.length){
                this.stopLoop('heroMove');
                this.startLoop('heroMove', h);
            }
            this.go('hideInfo');
        }

        return entities;
    };

    me.swipe = function(elapsed, evt, entities){
        var
        e = entities[0],
        com = e.getComponent(name);

        if (!com) return entities;

        viewX += evt[0] - evt[2];
        viewY += evt[1] - evt[3];
        calculateView(this.mapWidth, this.mapHeight, this.tileWidth, this.tileHeight);

        evt[2] = evt[0];
        evt[3] = evt[1];
        return entities;
    };

    me.draw = function(ctx, ent, clip){
        var
        tileSet = this.tileSet,
        map = this.map,
        terrain = this.terrain,
        mapW = this.mapWidth,
        mapH = this.mapHeight,
        objects = this.objects,
        flags = this.flags,
        hints = this.hints,
        tileW = this.tileWidth,
        tileH = this.tileHeight,
        sd = this.smallDevice,
        hw = Floor(tileW/2),
        hh = Floor(tileH/2),
        w = viewStart,
        fw = sd ? 8 : 16,
        fh = sd ? 16 : 32,
        fx = tileW - fw,
        fy = tileH - fh,
        hero = this.hero,
        hp = hero.getPosition(),
        selectedSpell = hero.getSelectedSpell(),
        hint, flag, x, y, i, j, object, tileId;

        screenshotX = viewX, screenshotY = viewY;

        ctx.save();
        //ctx.font = 'bold 12pt sans-serif';
        //ctx.textAlign = 'center';
        //ctx.textBaseline = 'middle';
        for(i=0; i<viewHeight; i++){
            for(j=0; j<viewWidth; j++, w++){
                tileId = map[w];
                x = viewX + tileW * (w%mapW), y = viewY + tileH * Floor(w/mapW);
                if (tileId & G_TILE_TYPE.HIDE){
                    tileSet.draw(ctx, UNCLEAR, x, y, tileW, tileH);
                }else{
                    tileSet.draw(ctx, terrain[w], x, y, tileW, tileH);
                    object = objects[w];
                    flag = flags[w];
                    if (flag){
                        tileSet.draw(ctx, flag[0], x, y, tileW, tileH);
                    }else if (object){
                        tileSet.draw(ctx, object[0], x, y, tileW, tileH);
                    }
                    hint = hints[w];
                    if (hint > 9){
                        //ctx.fillStyle = G_HINT_COLOR[Floor((hint & 0x0f)*0.5)];
                        //ctx.fillText(Floor(hint/16), x+hw, y+hh, tileW);
                        tileSet.draw(ctx, G_NUMERIC.LARGE_LIGHT + Floor(hint/16), x+fx, y+fy, fw, fh);
                    }
                }
            }
            w += viewWrap;
        }
        // draw borders
        j = viewY - tileH + tileH * Floor(viewStart/mapW);
        y += tileH;
        w = x+tileW;
        for (i=viewX - tileW + tileW * (viewStart%mapW); x > i; x-=tileW){
            tileSet.draw(ctx, STONE, x, j, tileW, tileH);
            tileSet.draw(ctx, STONE, x, y, tileW, tileH);
        }

        x = w;
        for (j-=tileH; y > j; y-=tileH){
            tileSet.draw(ctx, STONE, x, y, tileW, tileH);
            tileSet.draw(ctx, STONE, i, y, tileW, tileH);
        }

        // draw player active skill
        if (selectedSpell && selectedSpell[0] === G_SPELL.ALL_SEEING[0]){
            x = viewX + tileW * (hp%mapW), y = viewY + tileH * Floor(hp/mapW);
            tileSet.draw(ctx, G_UI.FLAG, x, y, hw, hh);
        }

        // draw transparent objects
        ctx.globalAlpha = 0.6;
        w = viewStart;
        for(i=0; i<viewHeight; i++){
            for(j=0; j<viewWidth; j++, w++){
                object = objects[w];
                if (!flags[w] || !object) continue;
                x = viewX + tileW * (w%mapW), y = viewY + tileH * Floor(w/mapW);
                tileSet.draw(ctx, object[0], x, y, tileW, tileH);
            }
            w += viewWrap;
        }

        ctx.restore();
    };

    me.drawScreenshot = function(ctx, ent, clip, bitmap){
        ctx.save();
        ctx.drawImage(bitmap, viewX-screenshotX, viewY-screenshotY);
        ctx.restore();
    };
});
