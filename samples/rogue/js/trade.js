pico.def('trade', 'picUIContent', function(){
    var
    me = this,
    Floor = Math.floor, Ceil = Math.ceil, Round = Math.round, Random = Math.random,
    name = me.moduleName,
    TRADE_ROW = 4, TRADE_COL = 4,
    labels = ['Close'],
    goods = undefined,
    onCustomBound = function(ent, rect, ui, scale){
        return me.calcUIRect(rect, ui, scale);
    },

    me.draw = function(ctx, ent, clip){
        if (!goods){
            me.close.call(this);
            return;
        }

        var
        com = ent.getComponent(name),
        rect = ent.getComponent(com.box),
        rectW = rect.width,
        ts = this.tileSet,
        tw = this.tileWidth,
        th = this.tileHeight,
        x = rect.x,
        y = rect.y,
        fontColor = G_COLOR_TONE[1],
        i, j, l, block;

        ctx.save();

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = com.font;
        ctx.fillStyle = fontColor;

        block = layouts[0];
        ctx.fillText('Trade', block[0]+(block[2])/2, block[1]+(block[3])/2, block[3]);

        for(i=1,j=0, l=layouts.length-1; i<l; i++,j++){
            block = layouts[i];
            ts.draw(ctx, G_UI.SLOT, block[0], block[1], tw, th);
            slot = goods[j];
            if (!slot) continue;
            ts.draw(ctx, slot[OBJECT_ICON], block[0], block[1], tw, th);
        }

        // draw buttons
        me.drawButtons(ctx, [layouts[layouts.length-1]], labels, fontColor, G_COLOR_TONE[3], G_COLOR_TONE[3]);

        ctx.restore();
    };
    onCustomDraw = function(ent, ctx, rect, ui, ts, scale){
        var
        com = ent.getComponent(name),
        i = ui.userData.id,
        activated = com.activated,
        slots = this.hero.getBag(),
        x=rect[0], y=rect[1], w=rect[2], h=rect[3],
        slot, item, count;

        slot = slots[i];
        if (!slot) return;
        item = slot[0];
        count = slot[1];
        ts.draw(ctx, item[OBJECT_ICON], x, y, w, h);
        if(count > 1)  ctx.fillText(count, x+w, y+h, w);
        if (i === com.activated) {
            ts.draw(ctx, G_UI.SELECTED, x, y, w, h);
        }
    },
    me.click = function(elapsed, evt, entities){
        if (!goods) return entities;
        var 
        e = entities[0],
        com = e.getComponent(name);

        if (!com) return entities;

        if (layouts.length){
            var
            x = evt[0],
            y = evt[1],
            btn;
            for(var i=0, l=layouts.length; i<l; i++){
                btn = layouts[i];
                if (x > btn[0] && x < btn[0]+btn[2] && y > btn[1] && y < btn[1]+btn[3]){
                    this.go('hideTrade');
                    break;
                }
            }
        }
        return;
    };
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
    onCustomUI = function(){
        switch(Array.prototype.shift.call(arguments)){
        case me.CUSTOM_BOUND: return onCustomBound.apply(this, arguments); break;
        case me.CUSTOM_DRAW: return onCustomDraw.apply(this, arguments); break;
        case me.CUSTOM_CLICK: return onCustomClick.apply(this, arguments); break;
        case me.CUSTOM_BUTTON: return onCustomDraw.apply(this, arguments); break;
        }
    };

    me.create = function(ent, data){
        data = me.base.create.call(this, ent, data);

        data.font = this.smallDevice ? data.fontSmall : data.fontBig;
        return data;
    };

    me.open = function(ent, evt){
        goods = evt;
    };

    me.close = function(){
        goods = undefined;
    };

    me.isValid = function(){
        return undefined !== goods;
    };

    me.resize = function(ent, width, height){
        var
        com = ent.getComponent(name),
        style = {font: com.font,fillStyle:com.fontColor},
        size = 32,
        actualSize = this.smallDevice ? size : size*2,
        meshui,rows,row,cell,i,l;

        meshui = me.createMeshUI(null, me.TOP_LEFT, me.TOP_LEFT, 0, width, Max(height, actualSize * 4), style);
        rows=meshui.rows;

        row=me.createMeshRow(rows);
        cell=me.createMeshCell(row);
        me.createMeshText(cell, me.CENTER, me.CENTER, 0, 1, 1, com.name);

        for(i=0,l=TRADE_ROW;i<l;i++){
            row=me.createMeshRow(rows);
            cell=me.createMeshCell(row, cellOpt);
            cell=me.createMeshCell(row, cellOpt);
            cell=me.createMeshCell(row, cellOpt);
            me.createMeshTile(cell, me.CENTER, me.CENTER, 0, size, size, 'default', G_UI.SLOT);
            me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, size, size, 1, 0, {id:3+(i*4)});
            cell=me.createMeshCell(row, cellOpt);
            me.createMeshTile(cell, me.CENTER, me.CENTER, 0, size, size, 'default', G_UI.SLOT);
            me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, size, size, 1, 0, {id:2+(i*4)});
            cell=me.createMeshCell(row, cellOpt);
            me.createMeshTile(cell, me.CENTER, me.CENTER, 0, size, size, 'default', G_UI.SLOT);
            me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, size, size, 1, 0, {id:1+(i*4)});
            cell=me.createMeshCell(row, cellOpt);
            me.createMeshTile(cell, me.CENTER, me.CENTER, 0, size, size, 'default', G_UI.SLOT);
            me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, size, size, 1, 0, {id:0+(i*4)});
            cell=me.createMeshCell(row, cellOpt);
            cell=me.createMeshCell(row, cellOpt);
        }

        row=me.createMeshRow(rows);
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, 1, 1, 1, 0, {id:'trade'});

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

        return me.drawMeshUI.call(this, ctx, {default: this.tileSet}, ent, com, comBox, scale, onCustomUI);
    };
});
