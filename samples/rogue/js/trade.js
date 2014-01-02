pico.def('trade', 'picUIContent', function(){
    var
    me = this,
    Floor = Math.floor, Ceil = Math.ceil, Round = Math.round, Random = Math.random, Max = Math.max,
    name = me.moduleName,
    TRADE_ROW = 4, TRADE_COL = 4,
    labels = ['Close'],
    goods = undefined,
    onCustomBound = function(ent, rect, ui, scale){
        if ('btn1' === ui.userData.id) return me.calcUIRect(rect, ui);
        return me.calcUIRect(rect, ui, scale);
    },
    onCustomDraw = function(ent, ctx, rect, ui, ts, scale){
        var
        com = ent.getComponent(name),
        i = ui.userData.id,
        x=rect[0], y=rect[1], w=rect[2], h=rect[3];

        if ('btn1' === i){
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#204631';
            ctx.strokeStyle = '#204631';
            ctx.fillRect.apply(ctx, rect);
            ctx.strokeRect.apply(ctx, rect);
            ctx.fillStyle = '#d7e894';
            ctx.fillText(labels[0], rect[0]+rect[2]/2, rect[1]+rect[3]/2, rect[2]);
        }else{
            var good = goods[i];
            if (!good) return;

            ts.draw(ctx, good[OBJECT_ICON], x, y, w, h);
            if (i === com.activated) {
                ts.draw(ctx, G_UI.SELECTED, x, y, w, h);
            }
        }
    },
    onCustomButton = function(ent, ctx, rect, ui, ts, scale){
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = '#d7e894';
        ctx.strokeStyle = '#aec440';
        ctx.fillRect.apply(ctx, rect);
        ctx.strokeRect.apply(ctx, rect);
        ctx.fillStyle = '#204631';
        ctx.fillText(labels[0], rect[0]+rect[2]/2, rect[1]+rect[3]/2, rect[2]);
    },
    onCustomClick = function(ent, ui){
        var com = ent.getComponent(name);

        if (!ui){
            return false;
        }
        var i = ui.userData.id;

        if ('btn1' === i){
            this.go('hideTrade');
        }else{
            slot = goods[i];

            if (slot){
                com.activated = i;
                return true;
            }
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
    },
    hide = function(ent){
        me.close();
        this.hideEntity(ent);
    };

    me.create = function(ent, data){
        data = me.base.create.call(this, ent, data);

        data.font = this.smallDevice ? data.fontSmall : data.fontBig;
        data.activated = -1;
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
            cell=me.createMeshCell(row);
            cell=me.createMeshCell(row);
            cell=me.createMeshCell(row);
            me.createMeshTile(cell, me.CENTER, me.CENTER, 0, size, size, 'default', G_UI.SLOT);
            me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, size, size, 1, 0, {id:3+(i*4)});
            cell=me.createMeshCell(row);
            me.createMeshTile(cell, me.CENTER, me.CENTER, 0, size, size, 'default', G_UI.SLOT);
            me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, size, size, 1, 0, {id:2+(i*4)});
            cell=me.createMeshCell(row);
            me.createMeshTile(cell, me.CENTER, me.CENTER, 0, size, size, 'default', G_UI.SLOT);
            me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, size, size, 1, 0, {id:1+(i*4)});
            cell=me.createMeshCell(row);
            me.createMeshTile(cell, me.CENTER, me.CENTER, 0, size, size, 'default', G_UI.SLOT);
            me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, size, size, 1, 0, {id:0+(i*4)});
            cell=me.createMeshCell(row);
            cell=me.createMeshCell(row);
        }

        row=me.createMeshRow(rows);
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, 1, 1, 1, 0, {id:'btn1'});

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
