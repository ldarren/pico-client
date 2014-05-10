inherit('pico/picUIContent');

var hero = require('hero');
var god = require('god');

var
Floor=Math.floor,Ceil=Math.ceil,Round=Math.round,Random=Math.random,Max=Math.max,Min=Math.min,
name = me.moduleName,
TRADE_ROW = 4, TRADE_COL = 4,
money = '',
info = undefined,
content = undefined,
labels = undefined,
callbacks = undefined,
events = undefined,
market,
onCustomBound = function(ent, rect, ui, scale){
    return me.calcUIRect(rect, ui);
},
onCustomDraw = function(ent, ctx, rect, ui, tss, scale){
    var
    com = ent.getComponent(name),
    ts = tss[0],
    id = ui.userData.id,
    x=rect[0], y=rect[1], w=rect[2], h=rect[3],
    slot, good, value;

    if ('number' === typeof id){
        slot = content[id];
        if (!slot) return;
        good = slot[0];
        count = slot[1];

        ts.draw(ctx, good[OBJECT_ICON], x, y, w, h);
        if (id === com.activated) {
            ts.draw(ctx, G_UI.SELECTED, x, y, w, h);
        }
        if(count > 1)  {
            ctx.textBaseline='bottom';
            ctx.textAlign='left';
            var 
            border = 4*scale,
            x1 = x+border,
            y1 = y+h-border;

            ctx.strokeStyle = G_COLOR_TONE[3];
            ctx.lineWidth = 2;
            ctx.strokeText(count, x1, y1, w);
            ctx.fillStyle = G_COLOR_TONE[0];
            ctx.fillText(count, x1, y1, w);
        }
    }else{
        if (-1 !== id.indexOf('price')){
            slot = content[id.substr(5)];
            if (!slot) return;
            good = slot[0];
            count = slot[1];

            me.fillIconText(ctx, tss, money+market(good, count), rect, scale);
        }else if (-1 !== id.indexOf('btn')){
            me.drawButton(ctx, tss, labels[id.charAt(3)], rect, scale, G_COLOR_TONE[0], G_COLOR_TONE[3]);
        }else if (-1 !== id.indexOf('info')){
            me.fillIconText(ctx, tss, info[id.charAt(4)], rect, scale);
        }
        if ('piety' === id){
            me.fillIconText(ctx, tss, god.getPiety(), rect, scale);
        }else if ('gold' === id){
            me.fillIconText(ctx, tss, hero.getGold(), rect, scale);
        }else if ('desc' === id){
            if (-1 !== com.activated){
                slot = content[com.activated];
                if (!slot) return;
                good = slot[0];
                value = good[OBJECT_ICON];
                me.fillIconText(ctx, tss, (good[OBJECT_NAME] || G_OBJECT_NAME[value])+': '+(good[OBJECT_DESC] || G_OBJECT_DESC[value]), rect, scale);
            }
        }
    }
},
onCustomButton = function(ent, ctx, rect, ui, tss, scale){
    var id = ui.userData.id;

    if ('string' === typeof id){
        if (-1 !== id.indexOf('btn')){
            me.drawButton(ctx, tss, labels[id.charAt(3)], rect, scale, G_COLOR_TONE[3], G_COLOR_TONE[0], G_COLOR_TONE[1], 3);
        }
    }
},
onCustomClick = function(ent, ui){
    if (!ui){
        return false;
    }
    var
    com = ent.getComponent(name),
    id = ui.userData.id,
    slot,btnId;

    if ('number' === typeof id){
        slot = content[id];
        com.activated = -1;

        if (slot){
            com.activated = id;
            return true;
        }
    }else{
        btnId = id.substr(3);
        slot = callbacks[btnId];
        if (slot) {
            var 
            evt = events[btnId] || {},
            selected = evt['selected'] = com.activated;
            if (content[selected]) this.go(slot, evt);
        }else{
            this.go('hideTrade');
        }
        return true;
    }

    return false;
},
onCustomUI = function(){
    switch(Array.prototype.shift.call(arguments)){
    case me.CUSTOM_BOUND: return onCustomBound.apply(this, arguments); break;
    case me.CUSTOM_DRAW: return onCustomDraw.apply(this, arguments); break;
    case me.CUSTOM_CLICK: return onCustomClick.apply(this, arguments); break;
    case me.CUSTOM_BUTTON: return onCustomButton.apply(this, arguments); break;
    }
};

me.sellPrice = function(object, count){
    if (!object) return 0;
    var baseValue = 1;
    switch(object[OBJECT_TYPE]){
    case G_OBJECT_TYPE.HERO: return 1000;
    case G_OBJECT_TYPE.POTION: baseValue = 1; break;
    case G_OBJECT_TYPE.SCROLL: baseValue = 2; break;
    case G_OBJECT_TYPE.WEAPON: baseValue = 2; break;
    case G_OBJECT_TYPE.AMMO: baseValue = 1; break;
    case G_OBJECT_TYPE.ARMOR: baseValue = 3; break;
    case G_OBJECT_TYPE.JEWEL: baseValue = 3; break;
    case G_OBJECT_TYPE.MATERIAL: baseValue = 1; break;
    }
    baseValue *= object[OBJECT_LEVEL];
    baseValue *= object[OBJECT_GRADE];
    baseValue *= count;
    return baseValue;
};

me.buyPrice = function(object, count){ return Ceil(me.sellPrice(object, count)*1.5); };
me.gamblePrice = function(object){return object[OBJECT_LEVEL] * 100;};
me.upgradePrice = function(object){return count * object[OBJECT_LEVEL] * 2;};
me.imbuePrice = function(object){return count * object[OBJECT_LEVEL] * 2;};

me.getShop = function() { return content; };
me.getMarket = function() { return market; };
me.getMoneyIcon = function() { return money; };

me.create = function(ent, data){
    data = me.base.create.call(this, ent, data);

    data.font = this.smallDevice ? data.fontSmall : data.fontBig;
    data.activated = -1;
    return data;
};

me.show = function(ent, com, evt){
    if (!evt) return;
    info = evt.info
    content = evt.content;
    labels = evt.labels;
    callbacks = evt.callbacks;
    events = evt.events || [];
    money = evt.type ? '`0'+evt.type+' ' : '`0195 ';
    market = evt.market || me.sellPrice;
    com.activated = -1;
};

me.hide = function(ent, com, evt){
    if (undefined === evt) return;
    callbacks = undefined;
};

me.isValid = function(){
    return undefined !== callbacks;
};

me.resize = function(ent, width, height){
    if (!me.isValid()) return [width, height];

    var
    com = ent.getComponent(name),
    style = {font: com.font,fillStyle:com.fontColor},
    tw = this.tileWidth,
    th = this.tileHeight,
    rowC = Max(TRADE_ROW, Ceil(content.length / TRADE_COL)),
    meshui,rows,row,cell,i,l;

    meshui = me.createMeshUI(null, me.TOP_LEFT, me.TOP_LEFT, 0, width, Max(height, th * (3 + info.length + (2*rowC) + 1)), style);
    rows=meshui.rows;

    row=me.createMeshRow(rows);
    for(i=0,l=labels.length; i<l; i++){
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.TOP, me.TOP, 0, 1, th, 1, 0, {id:'btn'+i});
    }

    row=me.createMeshRow(rows);
    cell=me.createMeshCell(row);
    me.createMeshText(cell, me.CENTER, me.CENTER, 0, 1, 1, '`0'+G_UI.GOLD);
    cell=me.createMeshCell(row);
    me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, 1, 1, 0, 0, {id:'gold'});
    cell=me.createMeshCell(row);
    me.createMeshText(cell, me.CENTER, me.CENTER, 0, 1, 1, '`0'+G_UI.PIETY);
    cell=me.createMeshCell(row);
    me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, 1, 1, 0, 0, {id:'piety'});

    for(i=0,l=info.length; i<l; i++){
        row=me.createMeshRow(rows);
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, 1, 1, 0, 0, {id:'info'+i});
    }

    row=me.createMeshRow(rows);
    cell=me.createMeshCell(row);
    me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, 1, 1, 0, 0, {id:'desc'});

    for(i=0,l=rowC;i<l;i++){
        row=me.createMeshRow(rows);
        me.createMeshCell(row);
        cell=me.createMeshCell(row);
        me.createMeshTile(cell, me.CENTER, me.CENTER, 0, 32, 32, 0, G_UI.SLOT);
        me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, tw, th, 1, 0, {id:(i*TRADE_COL)});
        cell=me.createMeshCell(row);
        me.createMeshTile(cell, me.CENTER, me.CENTER, 0, 32, 32, 0, G_UI.SLOT);
        me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, tw, th, 1, 0, {id:1+(i*TRADE_COL)});
        cell=me.createMeshCell(row);
        me.createMeshTile(cell, me.CENTER, me.CENTER, 0, 32, 32, 0, G_UI.SLOT);
        me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, tw, th, 1, 0, {id:2+(i*TRADE_COL)});
        cell=me.createMeshCell(row);
        me.createMeshTile(cell, me.CENTER, me.CENTER, 0, 32, 32, 0, G_UI.SLOT);
        me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, tw, th, 1, 0, {id:3+(i*TRADE_COL)});
        me.createMeshCell(row);

        row=me.createMeshRow(rows);
        me.createMeshCell(row);
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.TOP, me.TOP, 0, 1, 1, 0, 0, {id:'price'+(i*TRADE_COL)});
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.TOP, me.TOP, 0, 1, 1, 0, 0, {id:'price'+(1+(i*TRADE_COL))});
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.TOP, me.TOP, 0, 1, 1, 0, 0, {id:'price'+(2+(i*TRADE_COL))});
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.TOP, me.TOP, 0, 1, 1, 0, 0, {id:'price'+(3+(i*TRADE_COL))});
        me.createMeshCell(row);
    }

    me.createMeshRow(rows);

    com.layout = meshui;

    return [meshui.w, meshui.h];
};

me.click = function(ent, x, y, state){
    var
    com = ent.getComponent(name),
    comBox = ent.getComponent(com.box),
    scale = this.smallDevice ? 1 : 2;

    return me.clickMeshUI.call(this, x, y, state, ent, com, comBox, scale, onCustomUI);
};

me.draw = function(ctx, ent, clip){
    var
    com = ent.getComponent(name),
    comBox = ent.getComponent(com.box),
    scale = this.smallDevice ? 1 : 2;

    return me.drawMeshUI.call(this, ctx, [this.tileSet], ent, com, comBox, scale, onCustomUI);
};
