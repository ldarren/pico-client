pico.def('bag', 'picUIContent', function(){
    var
    me = this,
    Floor = Math.floor, Ceil = Math.ceil, Random = Math.random, Round = Math.round, Max = Math.max,
    BAG_ROW = 4,
    name = me.moduleName,
    onCustomBound = function(ent, rect, ui, scale){
        return me.calcUIRect(rect, ui, scale);
    },
    onCustomDraw = function(ent, ctx, rect, ui, tss, scale){
        var
        com = ent.getComponent(name),
        ts = tss[0],
        i = ui.userData.id,
        slots = this.hero.getBag(),
        x=rect[0], y=rect[1], w=rect[2], h=rect[3],
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
    onCustomClick = function(ent, ui){
        var com = ent.getComponent(name);

        com.activated = -1;

        if (!ui){
            return false;
        }
        var
        i = ui.userData.id,
        slot = this.hero.getBag()[i];

        if (slot){
            com.activated = i;
            this.go('showInfo', {targetId: i, context: G_CONTEXT.BAG});
            return true;
        }else{
            this.go('hideInfo');
        }
        return false;
    },
    onCustomDrop = function(ent, ui, cell){
        var
        sourceId = ui.userData.id,
        slots = this.hero.getBag(),
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
        case me.CUSTOM_BUTTON: return onCustomDraw.apply(this, arguments); break;
        case me.CUSTOM_DROP: return onCustomDrop.apply(this, arguments); break;
        }
    };

    me.use('trade');

    me.useItem = function(elapsed, evt, entities){
        var
        targetName = evt.bag,
        e = me.findHost(entities, targetName);

        if (!e) return;

        var slots = this.hero.getBag();
        if (slots[evt.index]){
            return [e];
        }
    };

    me.lootItem = function(elapsed, evt, entities){
        var
        hero = this.hero,
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

    me.offerItem = function(elapsed, evt, entities){
        var
        hero = this.hero,
        bag = hero.getBag(),
        slot = bag[evt];

        if (!slot) return;

        this.god.incrPiety(me.trade.sellPrice(slot[0], 1));

        hero.removeFromBag(evt);

        return entities;
    };

    me.buyItem = function(elapsed, evt, entities){
        var
        hero = this.hero,
        shop = me.trade.getShop(),
        slot = shop[evt],
        templ = slot[0],
        count = slot[1],
        item = this.ai.spawnItem(templ[OBJECT_ICON], null, G_GRADE.COMMON, hero.getJob(), hero.getLevel());

        if (!item) return;

        if (hero.isBagFull()){
            this.go('showDialog', {info:G_MSG.BAG_FULL});
            return;
        }

        if (G_OBJECT_TYPE.AMMO === item[OBJECT_TYPE]) item[AMMO_SIZE] = count;

        hero.incrGold(-me.trade.buyPrice(item, count));
        hero.putIntoBag(item);

        return entities;
    };

    me.sellItem = function(elapsed, evt, entities){
        var
        hero = this.hero,
        bag = hero.getBag(),
        slot = bag[evt];

        if (!slot) return;

        hero.incrGold(me.trade.sellPrice(slot[0], 1));

        hero.removeFromBag(evt);

        return entities;
    };

    me.recycleItem = function(elapsed, evt, entities){
        var
        hero = this.hero,
        bag = hero.getBag(),
        slot = bag[evt];

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

        hero.removeFromBag(evt);

        return entities;
    };

    me.betItem = function(elapsed, evt, entities){
        var
        hero = this.hero,
        shop = me.trade.getShop(),
        slot = shop[evt],
        templ = slot[0],
        count = slot[1],
        item = this.ai.spawnItem(templ[OBJECT_ICON], null, G_GRADE.COMMON, hero.getJob(), hero.getLevel());

        if (!item) return;

        if (hero.isBagFull()){
            this.go('showDialog', {info:G_MSG.BAG_FULL});
            return;
        }

        if (G_OBJECT_TYPE.AMMO === item[OBJECT_TYPE]) item[AMMO_SIZE] = count;

        hero.incrGold(-me.trade.buyPrice(item, count));
        hero.putIntoBag(item);

        return entities;
    };

    me.create = function(ent, data){
        data = me.base.create.call(this, ent, data);

        data.activated = -1;
        data.font = this.smallDevice ? data.fontSmall : data.fontBig;
        return data;
    };

    me.resize = function(ent, width, height){
        var
        com = ent.getComponent(name),
        comWin = ent.getComponent(com.win),
        cap = this.hero.getBagCap(),
        style = {font: com.font,fillStyle:com.fontColor},
        cellOpt = {drop: 1},
        size = 32,
        actualSize = this.tileWidth,
        meshui,rows,row,cell,i,l;

        if (comWin.maximized){
            meshui = me.createMeshUI(null, me.TOP_LEFT, me.TOP_LEFT, 0, width, Max(height, actualSize * (2+(cap/4))), style);
            rows=meshui.rows;
        }else{
            meshui = me.createMeshUI(null, me.TOP_LEFT, me.TOP_LEFT, 0, width, Max(height, actualSize * (1+cap)), style);
            rows=meshui.rows;
        }

        row=me.createMeshRow(rows);
        cell=me.createMeshCell(row);
        me.createMeshText(cell, me.CENTER, me.CENTER, 0, 1, 1, com.name);

        if (comWin.maximized){
            for(i=0,l=cap/4;i<l;i++){
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
        }else{
            for(i=0;i<cap;i++){
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
});
