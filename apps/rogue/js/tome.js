inherit('pico/picUIContent');

var hero = require('hero');

var
Floor = Math.floor, Ceil = Math.ceil, Random = Math.random, Round = Math.round, Max = Math.max,
CAP = 8, SKU = G_FEATURE_SHOP[1],
purchasable = false,
name = me.moduleName,
tomeId = G_WIN_ID.TOME,
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
    ts = tss[0],
    ss = tss[1],
    items = hero.getTome(),
    x=rect[0],y=rect[1],w=rect[2],h=rect[3],
    crop = scale * 4,
    cropLength = scale * 24,
    item;

    item = items[i];
    if (!item) return;
    // crop spell image to show slot frame
    ss.draw(ctx, item[OBJECT_ICON], x+crop, y+crop, cropLength, cropLength, 4, 4, 24, 24);
    if (item[SPELL_COOLDOWN]) {
        var
        ch = cropLength * (item[SPELL_COOLDOWN]/item[SPELL_RELOAD]),
        cy = cropLength - ch;
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillRect(x+crop, y+crop+cy, cropLength, ch);
    }else if (!hero.affordableSpell(item)){
        ts.draw(ctx, G_SHADE[4], x+crop, y+crop, cropLength, cropLength);
    }
    if (item === hero.getSelectedSpell()) ts.draw(ctx, G_UI.SELECTED, x, y, w, h);
},
onCustomButton = function(ent, ctx, rect, ui, tss, scale){
    if (CAP === ui.userData.id)
        me.drawButton(ctx, tss, G_MSG.BUY_LABEL, rect, scale, G_COLOR_TONE[3], G_COLOR_TONE[0], G_COLOR_TONE[1], 3);
},
onCustomClick = function(ent, ui){
    if (!ui) return false;

    var
    id = ui.userData.id,
    spell = hero.getTome()[id],
    toggle = hero.getSelectedSpell() === spell;

    hero.selectSpell(); // disable first
    if (!toggle) hero.selectSpell(spell);

    if (hero.getSelectedSpell()){
        this.go('showInfo', {targetId: id, context:G_CONTEXT.TOME});
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
    items = hero.getTome(),
    item, targetId;

    item = items[sourceId];
    if (!item) return false;

    targetId = cell[2].userData.id;
    items[sourceId] = items[targetId];
    items[targetId] = item;
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

me.chantScroll = function(elapsed, evt, entities){
    var
    targetId = evt[0],
    stat = hero.removeFromBag(targetId);

    switch(stat[OBJECT_SUB_TYPE]){
        case G_SCROLL_TYPE.MANUSCRIPT:
            if (hero.isTomeFull()){
                this.go('showDialog', {info:G_MSG.TOME_FULL});
                return;
            }
            hero.putIntoTome.call(this);
            break;
        case G_SCROLL_TYPE.IDENTITY:
            break;
        case G_SCROLL_TYPE.TELEPORT:
            hero.setLastWayPoint(this.currentLevel);
            this.go('teleport', 0);
            break;
        case G_SCROLL_TYPE.MAP:
            break;
    }
    return entities;
};

me.forgetSpell = function(elapsed, evt, entities){
    var
    tome = hero.getTome(),
    spell = tome[evt];

    if (!spell) return;

    delete tome[evt];

    hero.incrHp(1);
    return entities;
};

me.upgradeSpell = function(tome, fireC, airC, waterC, earthC, isInit){
    var
    changes = [],
    spell, oldLevel, newLevel, oldCooldown, spellTempl, spellTemplId, lvl;

    for(var i=0,l=tome.length; i<l; i++){
        spell = tome[i];
        if (!spell) continue;
        spellTemplId = G_SPELL_ICON[spell[OBJECT_SUB_TYPE]];
        for(lvl=0; lvl<2; lvl++){
            spellTempl = G_OBJECT[spellTemplId+lvl];
            if (fireC < spellTempl[SPELL_FIRE] || airC < spellTempl[SPELL_AIR] || waterC < spellTempl[SPELL_WATER] || earthC < spellTempl[SPELL_EARTH])
                break;
        }
        oldLevel = spell[OBJECT_LEVEL];
        oldCooldown = spell[SPELL_COOLDOWN];
        spellTempl = G_OBJECT[spellTemplId+lvl];
        newLevel = spellTempl[OBJECT_LEVEL];
        if (newLevel === oldLevel) continue;
        spell = G_CREATE_OBJECT(spellTemplId+lvl);
        spell[SPELL_COOLDOWN] = oldCooldown;
        tome[i] = spell;
        changes.push('`1'+spell[OBJECT_ICON]+' '+spell[OBJECT_NAME]+' has changed from level '+oldLevel+' to '+newLevel);
    }
    if (!isInit && changes.length){
        this.go('showDialog', {info:changes});
    }
};

me.createSpell = function(id, job){
    var spell = G_CREATE_OBJECT(id);
    if (job & spell[SPELL_CLASS]){
        spell[SPELL_COST] = Ceil(spell[SPELL_COST]*0.1);
    }
    return spell;
};

me.createEffect = function(type, level, period, icon){
    var efx;

    switch(type){
    case G_EFFECT_TYPE.BURNED:      efx = G_CREATE_OBJECT(G_ICON.EFX_BURNED);       break;
    case G_EFFECT_TYPE.CURSED:      efx = G_CREATE_OBJECT(G_ICON.EFX_CURSED);       break;
    case G_EFFECT_TYPE.DISEASED:    efx = G_CREATE_OBJECT(G_ICON.EFX_DISEASED);     break;
    case G_EFFECT_TYPE.FEARED:      efx = G_CREATE_OBJECT(G_ICON.EFX_FEARED);       break;
    case G_EFFECT_TYPE.FROZEN:      efx = G_CREATE_OBJECT(G_ICON.EFX_FROZEN);      break;
    case G_EFFECT_TYPE.POISONED:    efx = G_CREATE_OBJECT(G_ICON.EFX_POISONED);     break;
    case G_EFFECT_TYPE.POISON_BLADE:efx = G_CREATE_OBJECT(G_ICON.EFX_POISON_BLADE); break;
    case G_EFFECT_TYPE.SQUEAL:      efx = G_CREATE_OBJECT(G_ICON.EFX_SQUEAL);       break;
    case G_EFFECT_TYPE.NOCTURNAL:   efx = G_CREATE_OBJECT(G_ICON.EFX_NOCTURNAL);    break;
    case G_EFFECT_TYPE.LYCAN:       efx = G_CREATE_OBJECT(G_ICON.EFX_LYCAN);        break;
    case G_EFFECT_TYPE.GROWL:       efx = G_CREATE_OBJECT(G_ICON.EFX_GROWL);        break;
    default: efx = G_CREATE_OBJECT(type); break;
    }

    if (icon) efx[OBJECT_ICON] = icon;
    if (level) efx[OBJECT_LEVEL] = level;

    efx[EFFECT_PERIOD] = period || -1;

    return efx;
};

me.create = function(ent, data){
    me.checkExt(null, data.iab);
    data = me.base.create.call(this, ent, data);

    data.font = this.smallDevice ? data.fontSmall : data.fontBig;
    return data;
};

me.checkExt = function(err, iab){
    if (err) return console.error(JSON.stringify(err));
    if (!iab){
        purchasable = false;
        CAP = 4;
        return;
    }
    if (-1 === iab.ownedSkus.indexOf(SKU)){
        purchasable = true;
        CAP = 4;
    }else{
        purchasable = false;
        CAP = 4 + 4;
    }
};

me.getCap = function(){return CAP};

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
            me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, size, size, 1, 1, {id:0+(i*4)});
            cell=me.createMeshCell(row, cellOpt);
            me.createMeshTile(cell, me.CENTER, me.CENTER, 0, size, size, 0, G_UI.SLOT);
            me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, size, size, 1, 1, {id:1+(i*4)});
            cell=me.createMeshCell(row, cellOpt);
            me.createMeshTile(cell, me.CENTER, me.CENTER, 0, size, size, 0, G_UI.SLOT);
            me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, size, size, 1, 1, {id:2+(i*4)});
            cell=me.createMeshCell(row, cellOpt);
            me.createMeshTile(cell, me.CENTER, me.CENTER, 0, size, size, 0, G_UI.SLOT);
            me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, size, size, 1, 1, {id:3+(i*4)});
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

    return me.drawMeshUI.call(this, ctx, [this.tileSet, this.spellSet], ent, com, comBox, scale, onCustomUI);
};
