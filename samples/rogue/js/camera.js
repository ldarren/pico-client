pico.def('camera', 'picBase', function(){
    var
    me = this,
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

            viewTop = Math.floor((viewTop-viewY)/tileHeight);
            viewLeft = Math.floor((viewLeft-viewX)/tileWidth);
            viewBottom = Math.ceil((viewBottom-viewY)/tileHeight);
            viewRight = Math.ceil((viewRight-viewX)/tileWidth);

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
        vy = viewY + Math.floor(viewStart / this.mapWidth)*tw,
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
        x = Math.floor((evt[0] - viewX) / this.tileWidth),
        y = Math.floor((evt[1] - viewY) / this.tileHeight),
        id, tileType;

        if (y > mapH || x > mapW) return;
        id = mapW * y + x;
        tileType = map[id];

        if (tileType & G_TILE_TYPE.HIDE){
            if (this.nearToHero(id)) {
                if (this.activatedSkill){
                    this.flags[id] = this.activatedSkill;
                }else{
                    this.fillTiles(id);
                    this.flags[id] = undefined;
                }
            }else{
                var 
                hp = this.heroPos,
                h = this.findPath(hp, this.nextTile(id, hp));
                if (h.length){
                    this.stopLoop('heroMove');
                    this.startLoop('heroMove', h);
                }
            }
        }

        tileType = map[id]; // last action might hv updated tileType
        if (!(tileType & G_TILE_TYPE.HIDE)){
            if(this.objects[id]){
                var objId = this.objects[id];

                if (objId === this.heroJob){
                    if (!this.solve(this.heroPos)) return;
                }else{
                    this.go('showInfo', {creepId:objId});
                    if (tileType & G_TILE_TYPE.CREEP){
                        this.go('showDialog', {
                            info: ['RIP', 'you were killed by '+G_OBJECT_NAME[objId]+' at level '+this.currentLevel, ' but your lineage will continue...'],
                            callback: 'reborn'});
                    }
                }
            }else{
                var h = this.findPath(this.heroPos, id);
                if (h.length){
                    this.stopLoop('heroMove');
                    this.startLoop('heroMove', h);
                }
                this.go('hideInfo');
            }
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
        width = this.tileWidth,
        height = this.tileHeight,
        hw = Math.floor(width/2),
        hh = Math.floor(height/2),
        w = viewStart,
        hint, x, y, i, j, objectId, tileId;

        screenshotX = viewX, screenshotY = viewY;

        ctx.save();
        ctx.font = 'bold 12pt sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for(i=0; i<viewHeight; i++){
            for(j=0; j<viewWidth; j++, w++){
                x = viewX + width * (w%mapW), y = viewY + height * Math.floor(w/mapW);
                tileId = map[w];
                if (tileId & G_TILE_TYPE.HIDE){
                    tileSet.draw(ctx, G_FLOOR.UNCLEAR, x, y, width, height);
                    if (flags[w]) tileSet.draw(ctx, flags[w], x, y, width, height);
                }else{
                    hint = hints[w];
                    objectId = objects[w];
                    tileSet.draw(ctx, terrain[w], x, y, width, height);
                    if (objectId){
                        tileSet.draw(ctx, objectId, x, y, width, height);
                    }
                    if (hint > 9){
                        ctx.fillStyle = G_HINT_COLOR[Math.floor((hint & 0x0f)*0.5)];
                        ctx.fillText(Math.floor(hint/16), x+hw, y+hh, width);
                    }
                }
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
