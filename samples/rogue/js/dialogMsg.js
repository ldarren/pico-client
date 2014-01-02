pico.def('dialogMsg', 'picUIContent', function(){
    var
    me = this,
    Floor = Math.floor, Ceil = Math.ceil, Round = Math.round, Random = Math.random,
    name = me.moduleName,
    msg,
    onCustomBound = function(ent, rect, ui, scale){
        return me.calcUIRect(rect, ui);
    },
    onCustomDraw = function(ent, ctx, rect, ui, ts, scale){
        if (!me.isValid()) return;
        var
        com = ent.getComponent(name),
        tw = this.tileWidth,
        th = this.tileHeight,
        x=rect[0], y=rect[1], w=rect[2], h=rect[3];

        switch(ui.userData.id){
        case 'text':
            var
            info = msg.info,
            l = info.length,
            dh = rect[3]/l;

            for(var i=0,l=info.length; i<l; i++){
                me.fillIconText(ctx, ts, info[i], rect[0], dh*i, rect[2], dh, scale);
            }
            break;
        default:
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#204631';
            ctx.strokeStyle = '#204631';
            ctx.fillRect.apply(ctx, rect);
            ctx.strokeRect.apply(ctx, rect);
            ctx.fillStyle = '#d7e894';
            ctx.fillText(msg.labels[ui.userData.id], rect[0]+rect[2]/2, rect[1]+rect[3]/2, rect[2]);
            break;
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
        ctx.fillText(msg.labels[ui.userData.id], rect[0]+rect[2]/2, rect[1]+rect[3]/2, rect[2]);
    },
    onCustomClick = function(ent, ui){
        if (!ui){
            hide.call(this, ent);
            return false;
        }

        var i = ui.userData.id;

        if ('btn1' === i){
        }else{
        }

        hide.call(this, ent);

        return true;
    },
    onCustomUI = function(){
        switch(Array.prototype.shift.call(arguments)){
        case me.CUSTOM_BOUND: return onCustomBound.apply(this, arguments); break;
        case me.CUSTOM_DRAW: return onCustomDraw.apply(this, arguments); break;
        case me.CUSTOM_CLICK: return onCustomClick.apply(this, arguments); break;
        case me.CUSTOM_BUTTON: return onCustomButton.apply(this, arguments); break;
        }
        return false;
    },
    hide = function(ent){
        me.close();
        this.hideEntity(ent);
    };

    me.create = function(ent, data){
        data = me.base.create.call(this, ent, data);

        data.font = this.smallDevice ? data.fontSmall : data.fontBig;
        return data;
    };

    me.open = function(ent, evt){
        msg = evt;
    };

    me.close = function(){
        msg = undefined;
    };

    me.isValid = function(){
        return undefined !== msg;
    };

    me.resize = function(ent, width, height){
        var
        com = ent.getComponent(name),
        style = {font:com.font, fillStyle:com.fontColor},
        meshui = me.createMeshUI(null, me.TOP_LEFT, me.TOP_LEFT, 0, width, height, style),
        rows = meshui.rows,
        labels = msg.labels,
        l = labels.length,
        row,cell,i;

        row=me.createMeshRow(rows);
        for(i=0; i<l; i++){
            cell=me.createMeshCell(row);
            me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, 1, 1, 1, 0, {id:i});
        }

        row=me.createMeshRow(rows);
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.TOP_LEFT, me.TOP_LEFT, 0, 3, 3, 0, 0, {id:'text'});

        row=me.createMeshRow(rows);
        cell=me.createMeshCell(row);

        row=me.createMeshRow(rows);
        cell=me.createMeshCell(row);

        com.layout = meshui;

        return [width, height];
    };

    me.click = function(elapsed, evt, entities){
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
