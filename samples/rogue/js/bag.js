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
        ts = tss['default'],
        i = ui.userData.id,
        activated = com.activated,
        slots = this.hero.getBag(),
        x=rect[0], y=rect[1], w=rect[2], h=rect[3],
        slot, item, count;

        slot = slots[i];
        if (!slot) return;
        item = slot[0];
        count = slot[1];
        ctx.baseline='bottom';
        ctx.align='right';
        ts.draw(ctx, item[OBJECT_ICON], x, y, w, h);
        if(count > 1)  ctx.fillText(count, x+w-(4*scale), y+h-(4*scale), w);
        if (i === com.activated) {
            ts.draw(ctx, G_UI.SELECTED, x, y, w, h);
        }
    },
    onCustomClick = function(ent, ui){
        var com = ent.getComponent(name);

        if (!ui){
            com.forSale = false; // click on bag but on the window
            return false;
        }
        var
        i = ui.userData.id,
        slot = this.hero.getBag()[i];

        if (slot){
            com.activated = i;
            this.go('showInfo', {targetId: i, context: com.forSale ? G_CONTEXT.MERCHANT_SALE : G_CONTEXT.BAG});
            return true;
        }
        return false;
    },
    onCustomDrop = function(ent, ui, cell){
        var
        sourceId = ui.userData.id,
        items = this.hero.getBag(),
        item, targetId;

        item = items[sourceId];
        if (!item) return false;

        targetId = cell[2].userData.id;
        items[sourceId] = items[targetId];
        items[targetId] = item;
        return true;
    },
    onCustomUI = function(){
        switch(Array.prototype.shift.call(arguments)){
        case me.CUSTOM_BOUND: return onCustomBound.apply(this, arguments); break;
        case me.CUSTOM_DRAW: return onCustomDraw.apply(this, arguments); break;
        case me.CUSTOM_CLICK: return onCustomClick.apply(this, arguments); break;
        case me.CUSTOM_BUTTON: return onCustomDraw.apply(this, arguments); break;
        case me.CUSTOM_DROP: return onCustomDrop.apply(this, arguments); break;
        }
    };

    me.create = function(ent, data){
        data = me.base.create.call(this, ent, data);

        data.forSale = false;
        data.activated;
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
        actualSize = this.smallDevice ? size : size*2,
        meshui,rows,row,cell,i,l;

        if (comWin.maximized){
            meshui = me.createMeshUI(null, me.TOP_LEFT, me.TOP_LEFT, 0, width, Max(height, actualSize * 4), style);
            rows=meshui.rows;
        }else{
            meshui = me.createMeshUI(null, me.TOP_LEFT, me.TOP_LEFT, 0, width, Max(height, actualSize * 17), style);
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
                me.createMeshTile(cell, me.CENTER, me.CENTER, 0, size, size, 'default', G_UI.SLOT);
                me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, size, size, 1, 1, {id:3+(i*4)});
                cell=me.createMeshCell(row, cellOpt);
                me.createMeshTile(cell, me.CENTER, me.CENTER, 0, size, size, 'default', G_UI.SLOT);
                me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, size, size, 1, 1, {id:2+(i*4)});
                cell=me.createMeshCell(row, cellOpt);
                me.createMeshTile(cell, me.CENTER, me.CENTER, 0, size, size, 'default', G_UI.SLOT);
                me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, size, size, 1, 1, {id:1+(i*4)});
                cell=me.createMeshCell(row, cellOpt);
                me.createMeshTile(cell, me.CENTER, me.CENTER, 0, size, size, 'default', G_UI.SLOT);
                me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, size, size, 1, 1, {id:0+(i*4)});
                cell=me.createMeshCell(row, cellOpt);
                cell=me.createMeshCell(row, cellOpt);
            }
        }else{
            for(i=0;i<cap;i++){
                row=me.createMeshRow(rows);
                cell=me.createMeshCell(row, cellOpt);
                me.createMeshTile(cell, me.CENTER, me.CENTER, 0, size, size, 'default', G_UI.SLOT);
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

    me.openForSale = function(elapsed, evt, entities){
        var ent = me.findHost(entities, G_WIN_ID.BAG);
        if (!ent) return entities;
        var com = ent.getComponent(name);
        com.forSale = true;
        return [ent];
    };

    me.useItem = function(elapsed, evt, entities){
        var
        targetName = evt.bag,
        e, com;
        for(var i=0,l=entities.length; i<l; i++){
            e = entities[i];
            if (targetName === e.name){
                com = e.getComponent(name);
                if (!com) continue;

                var items = this.hero.getBag();
                if (items[evt.index]){
                    return [e];
                }
            }
        }
    };

    me.lootItem = function(elapsed, evt, entities){
        var
        object = this.objects[evt],
        loot = object[CHEST_ITEM];

        if (!loot) return;

        this.hero.putIntoBag(loot);

        this.objects[evt] = G_CREATE_OBJECT(G_ICON.CHEST_EMPTY);

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

        return me.drawMeshUI.call(this, ctx, {default: this.tileSet}, ent, com, comBox, scale, onCustomUI);
    };
});
