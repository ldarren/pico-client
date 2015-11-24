inherit('pico/picUIWindow');

var info = require('info');
var dialogMsg = require('dialogMsg');
var trade = require('trade');
var god = require('god');
var hero = require('hero');

var
Floor = Math.floor, Ceil = Math.ceil, Round = Math.round, Random = Math.random,
playerId = G_WIN_ID.PLAYER,
tomeId = G_WIN_ID.TOME,
bagId = G_WIN_ID.BAG,
infoId = G_WIN_ID.INFO,
dialogMsgId = G_WIN_ID.DIALOG,
tradeId = G_WIN_ID.TRADE,
altarId = G_WIN_ID.ALTAR,
name = me.moduleName,
updateContent = function(ent, com){
    var
    comBox  = ent.getComponent(com.box),
    layout = com.layouts[com.maximized],
    canvas = com.canvas,
    ctx = canvas.getContext('2d'),
    wh = com.contentSize,
    mod = require(com.content);

    ctx.clearRect(0, 0, wh[0], wh[1]);
    mod.draw.call(this, canvas.getContext('2d'), ent, layout);
},
refreshContent = function(ent, com){
    var
    comBox  = ent.getComponent(com.box),
    layout = com.layouts[com.maximized],
    canvas = com.canvas,
    mod = require(com.content),
    wh = mod.resize.call(this, ent, comBox.width, comBox.height);

    if (wh[0] < 8) wh[0] = wh[0] * comBox.width;
    if (wh[1] < 8) wh[1] = wh[1] * comBox.height;

    canvas.setAttribute('width', wh[0]);
    canvas.setAttribute('height', wh[1]);
    com.contentSize = wh;

    mod.draw.call(this, canvas.getContext('2d'), ent, layout);

    if (com.scrollX + comBox.width > com.contentSize[0]) com.scrollX = 0;
    if (com.scrollY + comBox.height > com.contentSize[1]) com.scrollY = 0;
},
resizeContent = function(ent, com){
    var
    comBox = ent.getComponent(com.box),
    layouts = com.layouts,
    gs = com.gridSize, gs2 = gs*2,
    layout;

    if (com.maximized){
        layout = layouts[1];
        switch(ent.name){
        case playerId:
        case tomeId:
        case bagId:
            comBox.x = layout[0]+gs;
            comBox.y = layout[1]+gs;
            comBox.width = layout[2]-(gs2);
            comBox.height = layout[3]-(gs2);
            break;
        case infoId:
        case dialogMsgId:
        case tradeId:
        case altarId:
            comBox.x = layout[0];
            comBox.y = layout[1];
            comBox.width = layout[2];
            comBox.height = layout[3];
            break;
        }
    }else{
        layout = layouts[0];
        switch(ent.name){
        case playerId:
            comBox.x = layout[0]+gs;
            comBox.y = layout[1];
            comBox.width = layout[2]-gs2;
            comBox.height = layout[3]-gs;
            break;
        case tomeId:
            comBox.x = layout[0]+gs;
            comBox.y = layout[1]+gs;
            comBox.width = layout[2]-gs;
            comBox.height = layout[3]-gs2;
            break;
        case bagId:
            comBox.x = layout[0];
            comBox.y = layout[1]+gs;
            comBox.width = layout[2]-gs;
            comBox.height = layout[3]-gs2;
            break;
        case infoId:
        case dialogMsgId:
        case tradeId:
        case altarId:
            comBox.x = layout[0];
            comBox.y = layout[1];
            comBox.width = layout[2];
            comBox.height = layout[3];
            break;
        }
    }

    refreshContent.call(this, ent, com);
};

me.create = function(ent, data){
    data = me.base.create.call(this, ent, data);

    var gs = data.gridSize = this.smallDevice ? 8 : 16;

    switch(ent.name){
    case playerId:
        data.docks = [4+2+1, 8+4+2+1];
        data.minWidth = this.smallDevice ? 320 : 640;
        data.minHeight = this.tileHeight+gs;
        break;
    case tomeId:
        data.docks = [8+2+1, 8+4+2+1];
        data.minWidth = this.tileWidth+gs;
        data.minHeight = this.smallDevice ? 180 : 360;
        break;
    case bagId:
        data.docks = [8+4+2, 8+4+2+1];
        data.minWidth = this.tileWidth+gs;
        data.minHeight = this.smallDevice ? 180 : 360;
        break;
    case infoId:
        data.minHeight = this.smallDevice ? 112 : 224;
        break;
    case dialogMsgId:
    case tradeId:
        data.minWidth = this.smallDevice ? 320 : 640;
        data.minHeight = this.smallDevice ? 320 : 640;
        break;
    case altarId:
        data.minWidth = this.smallDevice ? 320 : 640;
        data.minHeight = this.smallDevice ? 480 : 640;
        break;
    }

    if (data.theme){
        var
        ts = this.tileSet,
        theme = data.theme,
        b = theme.BORDERS;

        if (!ts.getPatternImg(b.TOP)){
            ts.assignPatternImg(b.TOP, ts.cut(b.TOP, gs, gs));
            ts.assignPatternImg(b.LEFT, ts.cut(b.LEFT, gs, gs));
            ts.assignPatternImg(b.BOTTOM, ts.cut(b.BOTTOM, gs, gs));
            ts.assignPatternImg(b.RIGHT, ts.cut(b.RIGHT, gs, gs));
        }
    }

    return data;
};

me.resize = function(elapsed, evt, entities){
    var com, comBox, ent, gs, layouts, i, l;
    
    this.showEntity(infoId);
    this.showEntity(dialogMsgId);
    this.showEntity(tradeId);
    this.showEntity(altarId);

    for(i=0, l=entities.length; i<l; i++){
        ent = entities[i];
        com = ent.getComponent(name);
        if (!com) continue;

        gs = com.gridSize;
        layouts = com.layouts;

        layouts.length = 0;

        switch(ent.name){
        case playerId:
            layouts.push(me.fitIntoGrid(
                [evt[0] + Floor((evt[2] - com.minWidth)/2), evt[1], com.minWidth, com.minHeight],
                gs, gs, false));
            break;
        case tomeId:
            layouts.push(me.fitIntoGrid(
                [evt[0] + evt[2] - com.minWidth, evt[1] + Floor((evt[3] - com.minHeight)/2), com.minWidth, com.minHeight],
                gs, gs, false));
            break;
        case bagId:
            layouts.push(me.fitIntoGrid(
                [evt[0], evt[1] + Floor((evt[3] - com.minHeight)/2), com.minWidth, com.minHeight],
                gs, gs, false));
            break;
        case infoId:
            layouts.push([evt[0], evt[1]+evt[3]-com.minHeight, evt[2], com.minHeight]);
            break;
        case dialogMsgId:
        case tradeId:
        case altarId:
            layouts.push([evt[0] + Ceil((evt[2] - com.minWidth)/2), evt[1] + Ceil((evt[3] - com.minHeight)/2), com.minWidth, com.minHeight]);
            break;
        }
        // maximized layout
        if (com.resizable)
            layouts.push(me.fitIntoGrid([evt[0]+1, evt[1]+1, evt[2]-2, evt[3]-2], gs, gs, true));
    }

    if (!info.isValid()) this.hideEntity(infoId);
    if (!dialogMsg.isValid()) this.hideEntity(dialogMsgId);
    if (!trade.isValid()) this.hideEntity(tradeId);
    if (!god.isValid()) this.hideEntity(altarId);

    for(i=0, l=entities.length; i<l; i++){
        ent = entities[i];
        com = ent.getComponent(name);
        if (!com) continue;

        resizeContent.call(this, ent, com);
    }

    //this.pause();
    //window.setTimeout(function(game){game.go('forceRefresh');}, 1000, this);
    this.go('resetView', hero.getPosition());
    return entities;
};

me.showAll = function(elapsed, evt, entities){
    if (dialogMsg.isValid()){
        this.showEntity(dialogMsgId);
        return entities;
    }
    if (trade.isValid()){
        this.showEntity(tradeId);
        return entities;
    }
    if (god.isValid()){
        this.showEntity(altarId);
        return entities;
    }

    this.showEntity(playerId);
    this.showEntity(tomeId);
    this.showEntity(bagId);

    if (info.isValid()) this.showEntity(infoId);

    return entities;
};

me.hideAll = function(elapsed, evt, entities){
    this.hideEntity(infoId);

    this.hideEntity(playerId);
    this.hideEntity(tomeId);
    this.hideEntity(bagId);

    this.hideEntity(altarId);
    this.hideEntity(tradeId);
    this.hideEntity(dialogMsgId);

    return entities;
};

me.showInfo = function(elapsed, evt, entities){
    if (!evt) return;

    var ent = this.showEntity(infoId, evt);
    if (!ent) return;

    resizeContent.call(this, ent, ent.getComponent(name));
    return entities;
};

me.hideInfo = function(elapsed, force, entities){
    if (this.hideEntity(infoId, true))return entities;
    if (force) return entities; // force update and refresh all ui
};

me.showDialog = function(elapsed, evt, entities){
    if (!evt) return;

    var ent = this.showEntity(dialogMsgId, evt);
    if (!ent) return;

    resizeContent.call(this, ent, ent.getComponent(name));
    return entities;
};

me.hideDialog = function(elapsed, evt, entities){
    if (this.hideEntity(dialogMsgId, true)) return entities;
};

me.showTrade = function(elapsed, evt, entities){
    if (!evt) return;

    var ent = this.showEntity(tradeId, evt);
    if (!ent) return;

    resizeContent.call(this, ent, ent.getComponent(name));
    return entities;
};

me.hideTrade = function(elapsed, evt, entities){
    if (this.hideEntity(tradeId, true)) return entities;
};

me.showAltar = function(elapsed, evt, entities){
    if (!evt) return;

    var ent = this.showEntity(altarId, evt);
    if (!ent) return;

    resizeContent.call(this, ent, ent.getComponent(name));
    return entities;
};

me.hideAltar = function(elapsed, evt, entities){
    if (this.hideEntity(altarId, true)) return entities;
};

me.maximise = function(elapsed, evt, entities){
    var ent = me.findHost(entities, evt[0]);
    if (!ent) return entities;

    me.hideAll.call(this, elapsed, evt, ret);
    me.showEntity(ent.name);

    var
    ret = [ent],
    com = ent.getComponent(name);

    com.maximized = com.resizable ? 1 : 0;

    resizeContent.call(this, com, ent);

    return ret;
};

me.checkBound = function(elapsed, evt, entities){
    var
    x = evt[0], y = evt[1],
    unknowns = [], selected = [],
    ent, com, comBox, active, layout;

    for (var i=0, l=entities.length; i<l; i++){
        ent = entities[i];
        com = ent.getComponent(name);
        if (!com) {
            unknowns.push(ent);
            continue;
        }
        comBox = ent.getComponent(com.box);
        layout = com.layouts[com.maximized];
        com.isValidClick = active = (layout[0] < x && (layout[0]+layout[2]) > x && layout[1] < y && (layout[1]+layout[3]) > y);
        if (active !== com.active){
            com.active = active;
        }
        if (active){
            selected.push(ent);
            var mod = require(com.content);
            if(mod.click.call(this, ent, com.scrollX + x - comBox.x, com.scrollY + y - comBox.y, 1)){
                updateContent.call(this, ent, com);
            }
        }
    }

    if (selected.length) return selected;

    return unknowns;
};

me.click = function(elapsed, evt, entities){
    var
    ent = entities[0], // should had 1 entity only
    com = ent.getComponent(name);

    if (!com || !com.isValidClick) return entities; // content scrolled, not a click
    com.isValidClick = false;

    var
    comBox = ent.getComponent(com.box),
    mod = require(com.content);
    if (!mod.click.call(this, ent, com.scrollX + evt[0] - comBox.x, com.scrollY + evt[1] - comBox.y, 0) && com.resizable){
        com.scrollX = com.scrollY = 0;
        com.maximized = com.maximized ? 0 : 1;
        if (com.maximized){
            me.hideAll.call(this, elapsed, evt, entities);
            this.showEntity(ent.name);
        }else{
            me.showAll.call(this, elapsed, evt, entities);
        }
    }
    resizeContent.call(this, ent, com);
    return entities;
};

me.startSwipe = function(elapsed, evt, entities){
    var
    ent = entities[0],
    com = ent.getComponent(name),
    comBox = ent.getComponent(com.box),
    mod = require(com.content);

    if (mod.pick.call(this, ent, evt[0]-comBox.x, evt[1]-comBox.y)){
        updateContent.call(this, ent, com);
        return entities;
    }

    var
    contentSize = com.contentSize,
    cw = contentSize[0], ww = comBox.width,
    ch = contentSize[1], wh = comBox.height,
    ratio;

    if (cw > ww){
        ratio = ww/cw;
        com.scrollBarH = [comBox.x+Floor(com.scrollX * ratio), comBox.y+comBox.height-2, Ceil(ww*ratio), ratio];
    }
    if (ch > wh){
        ratio = wh/ch;
        com.scrollBarV = [comBox.x+comBox.width-2, comBox.y+Floor(com.scrollY * ratio), Ceil(wh * ratio), ratio];
    }

    return entities;
};

me.swipe = function(elapsed, evt, entities){
    var
    ent = entities[0],
    com = ent.getComponent(name),
    comBox = ent.getComponent(com.box),
    mod = require(com.content);
    
    if (mod.drag.call(this, ent, evt[2]-comBox.x, evt[3]-comBox.y)){
        com.isValidClick = false;
        evt[2] = evt[0];
        evt[3] = evt[1];
        updateContent.call(this, ent, com);
        return entities;
    }

    var
    contentSize = com.contentSize,
    cw = contentSize[0], ww = comBox.width,
    ch = contentSize[1], wh = comBox.height,
    x = com.scrollX, y = com.scrollY,
    sh=com.scrollBarH, sv=com.scrollBarV;

    if (cw > ww){
        x += evt[2]-evt[0];
        if (x + ww > cw) x = cw - ww;
        else if (x < 0) x = 0;
        com.isValidClick = false;
    }else x = 0;
    if (ch > wh){
        y += evt[3]-evt[1];
        if (y + wh > ch) y = ch - wh;
        else if (y < 0) y = 0;
        com.isValidClick = false;
    }else y = 0;

    evt[2] = evt[0];
    evt[3] = evt[1];

    // some android browsers has problem to render decimal
    com.scrollX = Floor(x);
    com.scrollY = Floor(y);

    if (sh) sh[0] = comBox.x+Floor(x * sh[3]);
    if (sv) sv[1] = comBox.y+Floor(y * sv[3]);
    return entities;
};

me.endSwipe = function(elapsed, evt, entities){
    var
    ent = entities[0],
    com = ent.getComponent(name),
    comBox = ent.getComponent(com.box),
    mod = require(com.content);
    
    if(mod.drop.call(this, ent, evt[0]-comBox.x, evt[1]-comBox.y)){
        updateContent.call(this, ent, com);
        return entities;
    }

    com.scrollBarH = com.scrollBarV = undefined;
    return entities;
};

me.update = function(elapsed, evt, entities){
    var com, comBox, ent;

    for(var i=0, l=entities.length; i<l; i++){
        ent = entities[i];
        com = ent.getComponent(name);
        if (!com) continue;
        updateContent.call(this, ent, com);
    }
    return entities;
};

me.draw = function(ctx, ent, clip){
    var com = ent.getComponent(name);
    if (!com) return;

    var
    layout = com.layouts[com.maximized],
    gs = com.gridSize,
    comBox = ent.getComponent(com.box),
    contentW = comBox.width > com.contentSize[0] ? com.contentSize[0] : comBox.width,
    contentH = comBox.height > com.contentSize[1] ? com.contentSize[1] : comBox.height,
    sh = com.scrollBarH, sv = com.scrollBarV;

    ctx.save();

    ctx.beginPath();
    ctx.fillStyle = com.background;
    if (com.maximized) ctx.fillRect(clip[0], clip[1], clip[2], clip[3]);
    else ctx.fillRect(layout[0], layout[1], layout[2], layout[3]);
    ctx.drawImage(com.canvas,
        com.scrollX, com.scrollY, contentW, contentH,
        comBox.x, comBox.y, contentW, contentH);

    if (com.theme){
        var
        ts = this.tileSet,
        dock = com.docks[com.maximized],
        borders = com.theme.BORDERS,
        theme = com.active ? com.theme.ACTIVE : com.theme.INACTIVE;

        if (dock & 8) ts.fillPattern(ctx, borders.TOP, layout[0], layout[1], layout[2], gs);
        if (dock & 4) ts.fillPattern(ctx, borders.RIGHT, layout[0] + layout[2] - gs, layout[1], gs, layout[3]);
        if (dock & 2) ts.fillPattern(ctx, borders.BOTTOM, layout[0], layout[1]+layout[3]-gs, layout[2], gs);
        if (dock & 1) ts.fillPattern(ctx, borders.LEFT, layout[0], layout[1], gs, layout[3]);

        if (9 === (dock & 9)) ts.draw(ctx, theme.TOP_LEFT, layout[0], layout[1], gs, gs);
        if (12 === (dock & 12)) ts.draw(ctx, theme.TOP_RIGHT, layout[0] + layout[2] - gs, layout[1], gs, gs);
        if (3 === (dock & 3)) ts.draw(ctx, theme.BOTTOM_LEFT, layout[0], layout[1] + layout[3] - gs, gs, gs);
        if (6 === (dock & 6)) ts.draw(ctx, theme.BOTTOM_RIGHT, layout[0] + layout[2] - gs, layout[1] + layout[3] - gs, gs, gs);
    }

    // round line cap (middle line)
    if (sv || sh){
        ctx.globalCompositeOperation = 'lighter';

        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#666';
        ctx.lineCap = 'round';

        if (sv){
            ctx.moveTo(sv[0], sv[1]);
            ctx.lineTo(sv[0], sv[1] + sv[2]);
        }
        if (sh){
            ctx.moveTo(sh[0], sh[1]);
            ctx.lineTo(sh[0]+sh[2], sh[1]);
        }
        ctx.stroke();
    }

    ctx.restore();
};
