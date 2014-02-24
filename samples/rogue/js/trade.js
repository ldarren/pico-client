pico.def('trade', 'picUIContent', function(){
    var
    me = this,
    Floor = Math.floor, Ceil = Math.ceil, Round = Math.round, Random = Math.random, Max = Math.max,
    name = me.moduleName,
    TRADE_ROW = 4, TRADE_COL = 4,
    info = undefined,
    contents = undefined,
    labels = undefined,
    callbacks = undefined,
    onCustomBound = function(ent, rect, ui, scale){
        return me.calcUIRect(rect, ui);
    },
    onCustomDraw = function(ent, ctx, rect, ui, tss, scale){
        var
        com = ent.getComponent(name),
        ts = tss[0],
        i = ui.userData.id,
        x=rect[0], y=rect[1], w=rect[2], h=rect[3];

        if ('btn1' === i){
            me.drawButton(ctx, ts, labels[0], rect, scale, '#d7e894', '#204631');
        }else{
            var good = content[i];
            if (!good) return;

            ts.draw(ctx, good[OBJECT_ICON], x, y, w, h);
            if (i === com.activated) {
                ts.draw(ctx, G_UI.SELECTED, x, y, w, h);
            }
        }
    },
    onCustomButton = function(ent, ctx, rect, ui, tss, scale){
        if ('btn1' === ui.userData.id){
            var ts = tss[0];
            me.drawButton(ctx, ts, labels[0], rect, scale, '#204631', '#d7e894', '#aec440', 3);
        }
    },
    onCustomClick = function(ent, ui){
        if (!ui){
            return false;
        }
        var
        com = ent.getComponent(name),
        i = ui.userData.id;

        if ('btn1' === i){
            this.go('hideTrade');
        }else{
            slot = content[i];

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
    };

    me.create = function(ent, data){
        data = me.base.create.call(this, ent, data);

        data.font = this.smallDevice ? data.fontSmall : data.fontBig;
        data.activated = -1;
        return data;
    };

    me.show = function(ent, com, evt){
        info = evt.info;
        content = evt.content;
        labels = evt.labels;
        callbacks = evt.callbacks;
    };

    me.hide = function(ent, com, evt){
        if (undefined === evt) return;
        content = undefined;
    };

    me.isValid = function(){
        return undefined !== content;
    };

    me.resize = function(ent, width, height){
        if (!me.isValid()) return [width, height];

        var
        com = ent.getComponent(name),
        style = {font: com.font,fillStyle:com.fontColor},
        tw = this.tileWidth,
        th = this.tileHeight,
        rowC = Min(TRADE_ROW, Ceil(content.length / TRADE_COL)),
        meshui,rows,row,cell,i,l;

        meshui = me.createMeshUI(null, me.TOP_LEFT, me.TOP_LEFT, 0, width, Max(height, th * (1 + info.length + rowC + 1)), style);
        rows=meshui.rows;

        row=me.createMeshRow(rows);
        for(i=0,l=labels.length; i<l; i++){
            cell=me.createMeshCell(row);
            me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, 1, th, 1, 0, {id:'btn'+i});
        }

        row=me.createMeshRow(rows);
        for(i=0,l=info.length; i<l; i++){
            cell=me.createMeshCell(row);
            me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, 1, 1, 0, 0, {id:'info'+i});
        }

        for(i=0,l=RowC;i<l;i++){
            row=me.createMeshRow(rows);
            me.createMeshCell(row);
            me.createMeshCell(row);
            cell=me.createMeshCell(row);
            me.createMeshTile(cell, me.CENTER, me.CENTER, 0, tw, th, 0, G_UI.SLOT);
            me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, tw, th, 1, 0, {id:(i*TRADE_COL)});
            cell=me.createMeshCell(row);
            me.createMeshTile(cell, me.CENTER, me.CENTER, 0, tw, th, 0, G_UI.SLOT);
            me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, tw, th, 1, 0, {id:1+(i*TRADE_COL)});
            cell=me.createMeshCell(row);
            me.createMeshTile(cell, me.CENTER, me.CENTER, 0, tw, th, 0, G_UI.SLOT);
            me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, tw, th, 1, 0, {id:2+(i*TRADE_COL)});
            cell=me.createMeshCell(row);
            me.createMeshTile(cell, me.CENTER, me.CENTER, 0, tw, th, 0, G_UI.SLOT);
            me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, tw, th, 1, 0, {id:3+(i*TRADE_COL)});
            me.createMeshCell(row);
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

        return me.drawMeshUI.call(this, ctx, {default: this.tileSet}, ent, com, comBox, scale, onCustomUI);
    };
});
