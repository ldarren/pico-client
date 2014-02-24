pico.def('trade', 'picUIContent', function(){
    var
    me = this,
    Floor=Math.floor,Ceil=Math.ceil,Round=Math.round,Random=Math.random,Max=Math.max,Min=Math.min,
    name = me.moduleName,
    TRADE_ROW = 4, TRADE_COL = 4,
    info = undefined,
    content = undefined,
    labels = undefined,
    callbacks = undefined,
    onCustomBound = function(ent, rect, ui, scale){
        return me.calcUIRect(rect, ui);
    },
    onCustomDraw = function(ent, ctx, rect, ui, tss, scale){
        var
        com = ent.getComponent(name),
        ts = tss[0],
        id = ui.userData.id,
        x=rect[0], y=rect[1], w=rect[2], h=rect[3];

        if ('number' === typeof id){
            var slot = content[id];
            if (!slot) return;
            var
            good = slot[0],
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
            if (-1 !== id.indexOf('btn')){
                me.drawButton(ctx, tss, labels[id.charAt(3)], rect, scale, G_COLOR_TONE[0], G_COLOR_TONE[3]);
            }else if (-1 !== id.indexOf('info')){
                me.fillIconText(ctx, tss, info[id.charAt(4)], rect, scale);
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

            if (slot){
                com.activated = id;
                return true;
            }
        }else{
            btnId = id.indexOf(3);
            slot = callbacks[btnId];
            if (slot) this.go(slot, com.activated);
            this.go('hideTrade');
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
        rowC = Max(TRADE_ROW, Ceil(content.length / TRADE_COL)),
        meshui,rows,row,cell,i,l;

        meshui = me.createMeshUI(null, me.TOP_LEFT, me.TOP_LEFT, 0, width, Max(height, th * (1 + info.length + rowC + 1)), style);
        rows=meshui.rows;

        row=me.createMeshRow(rows);
        for(i=0,l=labels.length; i<l; i++){
            cell=me.createMeshCell(row);
            me.createMeshCustom(cell, me.TOP, me.TOP, 0, 1, th, 1, 0, {id:'btn'+i});
        }

        row=me.createMeshRow(rows);
        for(i=0,l=info.length; i<l; i++){
            cell=me.createMeshCell(row);
            me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, 1, 1, 0, 0, {id:'info'+i});
        }

        for(i=0,l=rowC;i<l;i++){
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

        return me.drawMeshUI.call(this, ctx, [this.tileSet], ent, com, comBox, scale, onCustomUI);
    };
});
