inherit('pico/picUIContent');
var god = require('god');
var hero = require('hero');
var ai = require('ai');
var socials = require('socials');
var trade = require('trade');

var
Floor = Math.floor, Ceil = Math.ceil, Random = Math.random, Round = Math.round, Max = Math.max,
CAP = 8, SKU = G_FEATURE_SHOP[0],
purchasable = false,
name = me.moduleName,
onCustomBound = function(ent, rect, ui, scale){
    return me.calcUIRect(rect, ui, scale);
},
onCustomDraw = function(ent, ctx, rect, ui, tss, scale){
    var i = ui.userData.id;

    // draw purchase button
    if (i === CAP){
        me.drawButton(ctx, tss, G_MSG.BUY_LABEL, rect, scale, G_COLOR_TONE[0], G_COLOR_TONE[3]);
        return;
    }

    var
    com = ent.getComponent(name),
    ts = tss[0],
    x=rect[0], y=rect[1], w=rect[2], h=rect[3],
    slots = hero.getBag(),
    slot, item, count;

    slot = slots[i];
    if (!slot) return;
    item = slot[0];
    count = slot[1];
    ts.draw(ctx, item[OBJECT_ICON], x, y, w, h);
    if (i === com.activated) {
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
},
onCustomButton = function(ent, ctx, rect, ui, tss, scale){
    if (CAP === ui.userData.id)
        me.drawButton(ctx, tss, G_MSG.BUY_LABEL, rect, scale, G_COLOR_TONE[3], G_COLOR_TONE[0], G_COLOR_TONE[1], 3);
},
onCustomClick = function(ent, ui){
    var com = ent.getComponent(name);

    com.activated = -1;

    if (!ui){
        return false;
    }
    var
    id = ui.userData.id,
    slot = hero.getBag()[id];

    if (slot){
        com.activated = id;
        this.go('showInfo', {targetId: id, context: G_CONTEXT.BAG});
        return true;
    }else{
        this.go('hideInfo', true);
        if (id === CAP){
            this.go('makeIAB', {sku:SKU, cb: me.checkExt});
        }
    }
    return false;
},
onCustomDrop = function(ent, ui, cell){
    var
    sourceId = ui.userData.id,
    slots = hero.getBag(),
    slot1, slot2, targetId;

    slot1 = slots[sourceId];
    if (!slot1) return false;

    targetId = cell[2].userData.id;
    slot2 = slots[targetId];
    slots[sourceId] = slot2;
    if (slot2) slot2[2] = sourceId;
    slots[targetId] = slot1;
    slot1[2] = targetId;
    return true;
},
onCustomUI = function(){
    if (!this.mortal) return;
    switch(Array.prototype.shift.call(arguments)){
    case me.CUSTOM_BOUND: return onCustomBound.apply(this, arguments); break;
    case me.CUSTOM_DRAW: return onCustomDraw.apply(this, arguments); break;
    case me.CUSTOM_CLICK: return onCustomClick.apply(this, arguments); break;
    case me.CUSTOM_BUTTON: return onCustomButton.apply(this, arguments); break;
    case me.CUSTOM_DROP: return onCustomDrop.apply(this, arguments); break;
    }
};

me.useItem = function(elapsed, evt, entities){
    var
    targetName = evt.bag,
    e = me.findHost(entities, targetName);

    if (!e) return;

    var slots = hero.getBag();
    if (slots[evt.index]){
        return [e];
    }
};

me.lootItem = function(elapsed, evt, entities){
    var
    object = this.objects[evt],
    loot = object[CHEST_ITEM];

    if (!loot) return;

    if (hero.isBagFull()){
        this.go('showDialog', {info:G_MSG.BAG_FULL});
        return;
    }

    hero.putIntoBag(loot);

    this.objects[evt] = G_CREATE_OBJECT(G_ICON.CHEST_EMPTY);

    return entities;
};

me.acceptGift = function(elapsed, evt, entities){
    var
    npcId = evt.npcId,
    npc = this.realNPCs[npcId],
    selected = evt.selected,
    stash = npc[NPC_GIFTS];

    if (!stash || selected+1 > stash.length) return;

    var slot = stash[selected];

    if (evt.isSell){
        socials.fbDeleteRequests(slot[2]);
        hero.incrGold(trade.sellPrice(slot[0], 1));
    }else{
        if (hero.isBagFull()){
            this.go('showDialog', {info:G_MSG.BAG_FULL});
            return;
        }
        socials.fbDeleteRequests(slot[2]);
        hero.putIntoBag(slot[0]);
    }
    stash.splice(selected, 1);

    if (!stash.length){
        var
        npcList = [G_ICON.BLACKSMITH, G_ICON.ARCHMAGE, G_ICON.TOWN_GUARD],
        npcTempl = G_OBJECT[npcList[npcId]],
        stashLoc = npcTempl[STASH_LOC];

        this.objects[stashLoc] = G_CREATE_OBJECT(G_ICON.STASH_EMPTY);
        this.go('hideTrade');
        return;
    }

    return entities;
};

me.offerItem = function(elapsed, evt, entities){
    var
    bag = hero.getBag(),
    selected = evt.selected,
    slot = bag[selected];

    if (!slot) return;

    god.incrPiety(trade.sellPrice(slot[0], 1));

    hero.removeFromBag(selected);

    return entities;
};

me.buyItem = function(elapsed, evt, entities){
    var
    shop = trade.getShop(),
    selected = evt.selected,
    slot = shop[selected],
    templ = slot[0],
    count = slot[1],
    item = ai.spawnItem(templ[OBJECT_ICON], null, G_GRADE.COMMON, hero.getLevel());

    if (!item) return;

    if (G_OBJECT_TYPE.AMMO === item[OBJECT_TYPE]) item[AMMO_SIZE] = count;

    hero.incrGold(-trade.buyPrice(item, count));
    hero.putIntoBag(item);

    return entities;
};

me.sellItem = function(elapsed, evt, entities){
    var
    bag = hero.getBag(),
    selected = evt.selected,
    slot = bag[selected];

    if (!slot) return;

    hero.incrGold(trade.sellPrice(slot[0], 1));

    hero.removeFromBag(selected);

    return entities;
};

me.giftItem = function(elapsed, evt, entities){
    var
    bag = hero.getBag(),
    selected = evt.selected,
    slot = bag[selected];

    if (!slot) return;

    hero.removeFromBag(selected);

    this.go('hideTrade');
    return entities;
};

me.recycleItem = function(elapsed, evt, entities){
    var
    bag = hero.getBag(),
    selected = evt.selected,
    slot = bag[selected];

    if (!slot) return;

    switch(slot[0][OBJECT_TYPE]){
    case G_OBJECT_TYPE.WEAPON:
        hero.incrPAtk(1);
        break;
    case G_OBJECT_TYPE.AMMO:
        hero.incrRAtk(1);
        break;
    case G_OBJECT_TYPE.ARMOR:
        hero.incrDef(1);
        break;
    case G_OBJECT_TYPE.JEWEL:
    case G_OBJECT_TYPE.POTION:
    case G_OBJECT_TYPE.SCROLL:
    case G_OBJECT_TYPE.MATERIAL:
        hero.incrWill(1);
        break;
    }

    hero.removeFromBag(selected);

    return entities;
};

// bag capacity already verified
me.betItem = function(elapsed, evt, entities){
    var
    level = hero.getLevel(),
    minLvl = level - 3,
    lvl = minLvl + Round(Random()*6),
    shop = trade.getShop(),
    selected = evt.selected,
    slot = shop[selected],
    templ = slot[0],
    item = ai.gamble(templ[OBJECT_ICON], hero.getStat(OBJECT_LUCK), lvl);

    if (!item) return;

    hero.incrGold(-trade.gamblePrice(templ, count));
    hero.putIntoBag(item);

    this.go('hideTrade');
    this.go('showDialog', {info:['Congrats!', 'You have obtained a '+item[OBJECT_NAME]]});
    return entities;
};

// item level already verified
me.upgradeItem = function(elapsed, evt, entities){
    var
    shop = trade.getShop(),
    selected = evt.selected,
    slot = shop[selected],
    templ = slot[0],
    item = ai.spawnItem(templ[OBJECT_ICON], null, G_GRADE.COMMON, templ[OBJECT_LEVEL]+1),
    info = ['Congrats, Item Level Up!'],
    diff;

    for(var i=OBJECT_LEVEL,l=item.length; i<l; i++){
        diff = item[i] - templ[i];
        if (diff){
            info.push('`0'+G_STAT_ICON[i]+' '+G_STAT_NAME[i]+(diff > 0 ? ' + ' : ' ')+diff);
        }
    }

    slot[0] = item;

    hero.incrGold(-trade.upgradePrice(templ, count));

    this.go('hideTrade');
    this.go('showDialog', {info:info});
    return entities;
};

me.imbueItem = function(elapsed, evt, entities){
    var
    shop = trade.getShop(),
    selected = evt.selected,
    slot = shop[selected],
    templ = slot[0],
    item = ai.gamble(templ[OBJECT_ICON], hero.getStat(OBJECT_LUCK)+99, templ[OBJECT_LEVEL]),
    info = [],
    diff;

    info.push((templ[OBJECT_NAME] === item[OBJECT_NAME] ? 'Item imbue failed!' : 'Congrats, you have obtained '+item[OBJECT_NAME]));

    for(var i=OBJECT_LEVEL,l=item.length; i<l; i++){
        diff = item[i] - templ[i];
        if (diff){
            info.push('`0'+G_STAT_ICON[i]+' '+G_STAT_NAME[i]+(diff > 0 ? ' + ' : ' ')+diff);
        }
    }

    slot[0] = item;
    hero.incrGold(-trade.imbuePrice(templ, count));

    this.go('hideTrade');
    this.go('showDialog', {info:info});
    return entities;
};

me.create = function(ent, data){
    me.checkExt(null, data.iab);
    data = me.base.create.call(this, ent, data);

    data.activated = -1;
    data.font = this.smallDevice ? data.fontSmall : data.fontBig;
    return data;
};

me.checkExt = function(err, iab){
    if (err) return console.error(JSON.stringify(err));
    if (!iab){
        purchasable = false;
        CAP = 8;
        return;
    }
    if (-1 === iab.ownedSkus.indexOf(SKU)){
        purchasable = true;
        CAP = 8;
    }else{
        purchasable = false;
        CAP = 8 + 12;
    }
};

me.getCap = function(){return CAP;};

me.resize = function(ent, width, height){
    var
    com = ent.getComponent(name),
    comWin = ent.getComponent(com.win),
    style = {font: com.font,fillStyle:com.fontColor},
    cellOpt = {drop: 1},
    size = 32,
    actualSize = this.tileWidth,
    meshui,rows,row,cell,i,l;

    if (comWin.maximized){
        meshui = me.createMeshUI(null, me.TOP_LEFT, me.TOP_LEFT, 0, width, Max(height, actualSize * ((purchasable ? 3 : 2)+(CAP/4))), style);
        rows=meshui.rows;
    }else{
        meshui = me.createMeshUI(null, me.TOP_LEFT, me.TOP_LEFT, 0, width, Max(height, actualSize * (1+CAP)), style);
        rows=meshui.rows;
    }

    row=me.createMeshRow(rows);
    cell=me.createMeshCell(row);
    me.createMeshText(cell, me.CENTER, me.CENTER, 0, 1, 1, com.name);

    if (comWin.maximized){
        for(i=0,l=CAP/4;i<l;i++){
            row=me.createMeshRow(rows);
            cell=me.createMeshCell(row, cellOpt);
            cell=me.createMeshCell(row, cellOpt);
            cell=me.createMeshCell(row, cellOpt);
            me.createMeshTile(cell, me.CENTER, me.CENTER, 0, size, size, 0, G_UI.SLOT);
            me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, size, size, 1, 1, {id:3+(i*4)});
            cell=me.createMeshCell(row, cellOpt);
            me.createMeshTile(cell, me.CENTER, me.CENTER, 0, size, size, 0, G_UI.SLOT);
            me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, size, size, 1, 1, {id:2+(i*4)});
            cell=me.createMeshCell(row, cellOpt);
            me.createMeshTile(cell, me.CENTER, me.CENTER, 0, size, size, 0, G_UI.SLOT);
            me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, size, size, 1, 1, {id:1+(i*4)});
            cell=me.createMeshCell(row, cellOpt);
            me.createMeshTile(cell, me.CENTER, me.CENTER, 0, size, size, 0, G_UI.SLOT);
            me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, size, size, 1, 1, {id:0+(i*4)});
            cell=me.createMeshCell(row, cellOpt);
            cell=me.createMeshCell(row, cellOpt);
        }

        if (purchasable){
            row=me.createMeshRow(rows);
            cell=me.createMeshCell(row);
            me.createMeshCustom(cell, me.TOP, me.TOP, 0, 1, actualSize, 1, 0, {id:CAP});
        }

        row=me.createMeshRow(rows);
    }else{
        for(i=0;i<CAP;i++){
            row=me.createMeshRow(rows);
            cell=me.createMeshCell(row, cellOpt);
            me.createMeshTile(cell, me.CENTER, me.CENTER, 0, size, size, 0, G_UI.SLOT);
            me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, size, size, 1, 0, {id:i});
        }
    }
    com.layout = meshui;

    return [meshui.w, meshui.h];
};

me.pick = function(ent, x, y){
    var
    com = ent.getComponent(name),
    comBox = ent.getComponent(com.box),
    scale = this.smallDevice ? 1 : 2;

    return me.pickMeshUI.call(this, x, y, ent, com, comBox, scale, onCustomUI);
};

me.drag = function(ent, x, y){
    var
    com = ent.getComponent(name),
    comBox = ent.getComponent(com.box),
    scale = this.smallDevice ? 1 : 2;

    return me.dragMeshUI.call(this, x, y, ent, com, comBox, scale, onCustomUI);
};

me.drop = function(ent, x, y){
    var
    com = ent.getComponent(name),
    comBox = ent.getComponent(com.box),
    scale = this.smallDevice ? 1 : 2;

    return me.dropMeshUI.call(this, x, y, ent, com, comBox, scale, onCustomUI);
};

me.deselectItem = function(elapsed, evt, entities){
    var ent = me.findHost(entities, G_WIN_ID.BAG);
    if (!ent) return entities;
    var com = ent.getComponent(name);
    com.activated = -1;
    return entities;
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
