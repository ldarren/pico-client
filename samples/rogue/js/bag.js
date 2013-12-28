pico.def('bag', 'picUIContent', function(){
    var
    me = this,
    Floor = Math.floor, Ceil = Math.ceil, Random = Math.random, Round = Math.round, Max = Math.max,
    BAG_ROW = 4,
    name = me.moduleName,
    onCustomBound = function(ent, rect, ui, scale){
        return me.calcUIRect(rect, ui, scale);
    },
    onCustomDraw = function(ent, ctx, rect, ui, ts, scale){
        var
        items = this.hero.getBag(),
        item, x, y;

        item = items[ui.userData.id];
        if (!item) return;
        ts.draw(ctx, item[OBJECT_ICON], rect[0], rect[1], rect[2], rect[3]);
        if (item[SPELL_COOLDOWN]) ts.draw(ctx, G_NUMERIC.LARGE_LIGHT + item[SPELL_COOLDOWN], rect[0], rect[1], rect[2], rect[3]);
        else if (item === this.hero.getSelectedSpell()) ts.draw(ctx, G_UI.SELECTED, rect[0], rect[1], rect[2], rect[3]);
    },
    onCustomClick = function(ent, ui){
        if (!ui){
            com.forSale = false; // click on bag but on the window
            return;
        }
        var item = this.hero.getBag()[ui.userData.id];

        if (bag[i]){
            com.activated = j;
            this.go('showInfo', {targetId: i, context: com.forSale ? G_CONTEXT.MERCHANT_SALE : G_CONTEXT.BAG});
        }
        return;
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
    draw = function(ctx, slots, layout, com){
        var
        ts = this.tileSet,
        tw = this.tileWidth,
        th = this.tileHeight,
        activated = com.activated,
        block, slot, item, count;

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = com.font;
        ctx.fillStyle = com.fontColor;

        block = layout[0];
        ctx.fillText(com.name, block[0]+block[2]/2, block[1]+block[3]/2, block[2]);
        
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        for(var i=1,j=0, l=layout.length; i<l; i++,j++){
            block = layout[i];
            ts.draw(ctx, G_UI.SLOT, block[0], block[1], tw, th);
            slot = slots[j];
            if (!slot) continue;
            item = slot[0];
            count = slot[1];
            ts.draw(ctx, item[0], block[0], block[1], tw, th);
            if(count > 1)  ctx.fillText(count, block[0]+tw, block[1]+th, tw);
        }
        if (activated) {
            block = layout[activated];
            ts.draw(ctx, G_SHADE[0], block[0], block[1], tw, th);
        }

        ctx.restore();
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
        com = ent.getComponent(name);
        comWin = ent.getComponent(com.win),
        cap = this.hero.getBagCap(),
        style = {font: com.font,fillStyle:"#aec440"},
        cellOpt = {drop: 1},
        size = 32,
        actualSize = this.smallDevice ? size : size*2,
        meshui,rows,row,cell,i,l;

        if (comWin.maximized){
            meshui = me.createMeshUI(null, me.TOP_LEFT, me.TOP_LEFT, 0, width, Max(height, actualSize * 4), style);
            rows=meshui.rows;
        }else{
            meshui = me.createMeshUI(null, me.TOP_LEFT, me.TOP_LEFT, 0, width, Max(height, actualSize * 9), style);
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

    me.click = function(ent, x, y, state){
        var
        e = entities[0],
        com = e.getComponent(name);

        if (!com) return entities;
        
        var
        tw = this.tileWidth,
        th = this.tileHeight,
        bag = this.hero.getBag(),
        layout = com.layout,
        x = evt[0],
        y = evt[1],
        tile, tx, ty;

        for(var i=0,j=1,jl=layout.length; j<jl; i++,j++){
            tile = layout[j];
            tx = tile[0];
            ty = tile[1];
            if (tx < x && (tx + tw) > x && ty < y && (ty + th) > y){
                if (bag[i]){
                    com.activated = j;
                    this.go('showInfo', {targetId: i, context: com.forSale ? G_CONTEXT.MERCHANT_SALE : G_CONTEXT.BAG});
                }
                return;
            }
        }
        com.forSale = false; // click on bag but on the window
        return entities;
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

        var empty = G_OBJECT[G_ICON.CHEST_EMPTY].slice();
        empty[OBJECT_NAME] = G_OBJECT_NAME[empty[OBJECT_ICON]];
        this.objects[evt] = empty;

        return entities;
    };

    me.draw = function(ctx, ent, clip){
        var
        com = ent.getComponent(name),
        comBox = ent.getComponent(com.box),
        scale = this.smallDevice ? 1 : 2;

        return me.drawMeshUI.call(this, ctx, {default: this.tileSet}, ent, com, comBox, scale, onCustomUI);
    };
});
