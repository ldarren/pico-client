inherit('pico/picBase');

var hero = require('hero');
var ai = require('ai');

var
UNCLEAR = G_FLOOR.UNCLEAR,
STONE = G_FLOOR.STONE,
Floor=Math.floor,Ceil=Math.ceil,Min=Math.min,Max=Math.max,
name = me.moduleName,
screenshotX=0, screenshotY=0,
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

        viewTop = Max(viewY, camY);
        viewLeft = Max(viewX, camX);
        viewBottom = Min(viewY+mapH, camY+camHeight);
        viewRight = Min(viewX+mapW, camX+camWidth);

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

me.viewPos = function(){
    return [viewX, viewY];
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

// center view to target pos
me.moveTo = function(elapsed, pos, entities){
    var tileW=this.tileWidth,tileH=this.tileHeight,mapW=this.mapWidth,mapH=this.mapHeight;

    // if not init, center the stage
    if (undefined === viewX) calculateView(mapW, mapH, tileW, tileH);

    // calculate target position from viewXY
    var vtx = viewX + tileW * (pos%mapW), vty = viewY + tileH * Floor(pos/mapW);

    // move view target to center of camera if target is out of view
    if (vtx < 32 || vtx > camWidth-32 || vty < 32 || vty > camHeight-32) {
        viewX += (camWidth/2)-vtx;
        viewY += (camHeight/2)-vty;
        calculateView(mapW, mapH, tileW, tileH);
    }

    screenshotX=viewX, screenshotY=viewY;
    return entities;
};

me.checkBound = function(elapsed, evt, entities){
    var
    /*x = evt[0], y = evt[1],
    tw = this.tileWidth,
    th = this.tileHeight,
    vx = viewX + (viewStart % this.mapWidth)*tw,
    vy = viewY + Floor(viewStart / this.mapWidth)*tw,
    vw = viewWidth*tw,
    vh = viewHeight*th,*/
    unknowns = [],
    e, com;

    for (var i=0, l=entities.length; i<l; i++){
        e = entities[i];
        com = e.getComponent(name);
        if (!com) {
            unknowns.push(e);
            continue;
        }
        //if (x > vx && y > vy && x < vx+vw && y < vy+vh){
            com.isValidClick = true;
            return [e];
        //}
    }

    return unknowns;
};

me.click = function(elapsed, evt, entities){
    var
    e = entities[0],
    com = e.getComponent(name);

    if (!com || !com.isValidClick) return entities;
    com.isValidClick = false;

    var
    mapW = this.mapWidth,
    mapH = this.mapHeight,
    x = Floor((evt[0] - viewX) / this.tileWidth),
    y = Floor((evt[1] - viewY) / this.tileHeight);

    if (y < 0 || x < 0 || y > mapH || x > mapW) return entities;

    var
    map = this.map,
    objects = this.objects,
    engaged = hero.getEngaged(),
    hp = hero.getPosition(),
    id = mapW * y + x,
    tileType, object, steps, isNear;
                    
    hero.setFocusTile(id === hp ? undefined : id);

    if (engaged && engaged.length && !hero.isEngaged(id)){
        this.go('showDialog', {
            info: [
                'Flee?',
                'Flee from battle? you might get damage if you failed'],
            labels: ['Flee', 'Stay'],
            callbacks: ['flee', null]
        });
        return entities;
    }

    tileType = map[id];
    object = objects[id];
    isNear = hp === id || this.nearToHero(id);

    if (isNear){
        if (tileType & G_TILE_TYPE.HIDE){
            if (hero.setFlag(id)){
                return entities;
            }else{
                if (tileType & G_TILE_TYPE.CREEP){
                    delete this.flags[id];
                    hero.setEngaged(id);
                }
                this.go('gameStep', this.fillTiles(id));
            }
        }
    }

    tileType = map[id]; // last action might hv updated tileType
    object = objects[id];

    if ((tileType & G_TILE_TYPE.HIDE)){
        this.audioSprite.play(1);
        this.go('heroMoveTo', [this.nextTile(id, hp)]);
    }else{
        if(object){
            if (hero.equal(object)){
                hero.toggleFlagMode();
            }else{
                if (isNear && G_OBJECT_TYPE.ENV === object[OBJECT_TYPE] && G_ENV_TYPE.ALTAR === object[OBJECT_SUB_TYPE]){
                    this.go('showAltar', {callback: 'forceRefresh'});
                }else{
                    this.go('showInfo', { targetId: id, context: G_CONTEXT.WORLD });
                }
            }
        }else{
            this.go('hideInfo');
            this.audioSprite.play(1);
            this.go('heroMoveTo', [id]);
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

    com.isValidClick = false;

    return entities;
};

me.draw = function(ctx, ent, clip){
    var
    tileSet = this.tileSet,
    npcSet = this.npcSet,
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
    fw = sd ? 8 : 16, fh = sd ? 16 : 32, fx = tileW - fw, fy = tileH - fh, cfx = Floor(fx/2), cfy = Floor(fy/2),
    focusId = hero.getFocusTile(),
    hp, hint, x, y, i, j, object, tileId, engaged;

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
                if (flags[w]){
                    tileSet.draw(ctx, G_ICON.BANNER, x, y, tileW, tileH);
                }
            }else{
                tileSet.draw(ctx, terrain[w], x, y, tileW, tileH);
                object = objects[w];
                if (object){
                    if (G_OBJECT_TYPE.CHEST === object[OBJECT_TYPE] && object[CHEST_ITEM])
                        tileSet.draw(ctx, object[CHEST_ITEM][OBJECT_ICON], x, y, tileW, tileH);
                    else if (G_OBJECT_TYPE.NPC === object[OBJECT_TYPE])
                        npcSet.draw(ctx, object[OBJECT_ICON], x, y, tileW, tileH);
                    else
                        tileSet.draw(ctx, object[OBJECT_ICON], x, y, tileW, tileH);
                }
                hint = hints[w];
                if (hint > 9){
                    //ctx.fillStyle = G_HINT_COLOR[Floor((hint & 0x0f)*0.5)];
                    //ctx.fillText(Floor(hint/16), x+hw, y+hh, tileW);
                    if (object)
                        tileSet.draw(ctx, G_NUMERIC.LARGE_LIGHT + Floor(hint/16), x+fx, y+fy, fw, fh);
                    else
                        tileSet.draw(ctx, G_NUMERIC.LARGE_LIGHT + Floor(hint/16), x+cfx, y+cfy, fw, fh);
                }
            }
            if (w === focusId){
                tileSet.draw(ctx, G_UI.FINGER, x+hw, y+hh, hw, hh);
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

    engaged = hero.getEngaged();
    if (engaged.length){
        // draw combat icon
        hp = hero.getPosition();
        x = viewX + tileW * (hp%mapW), y = viewY + tileH * Floor(hp/mapW);
        tileSet.draw(ctx, G_UI.PATK, x, y, hw, hh);
        for(i=0,j=engaged.length; i<j; i++){
            hp = engaged[i];
            x = viewX + tileW * (hp%mapW), y = viewY + tileH * Floor(hp/mapW);
            tileSet.draw(ctx, G_UI.PATK, x, y, hw, hh);
        }
    }else if (hero.isFlagMode()){
        // draw flag icon
        hp = hero.getPosition();
        x = viewX + tileW * (hp%mapW), y = viewY + tileH * Floor(hp/mapW);
        tileSet.draw(ctx, G_UI.FLAG, x, y, hw, hh);
    }

    // draw transparent objects
    //ctx.globalAlpha = 0.6;
    //w = viewStart;
    //for(i=0; i<viewHeight; i++){
    //    for(j=0; j<viewWidth; j++, w++){
    //        object = objects[w];
    //        if (!flags[w] || !object) continue;
    //        x = viewX + tileW * (w%mapW), y = viewY + tileH * Floor(w/mapW);
    //        tileSet.draw(ctx, object[OBJECT_ICON], x, y, tileW, tileH);
    //    }
    //    w += viewWrap;
    //}

    ctx.restore();
};

me.drawScreenshot = function(ctx, ent, clip, bitmap){
    ctx.save();
    ctx.drawImage(bitmap, viewX-screenshotX, viewY-screenshotY);
    ctx.restore();
};
