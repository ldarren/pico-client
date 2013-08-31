pico.def('info', 'picUIWindow', function(){
    var
    me = this,
    name = me.moduleName,
    info,
    drawSmall = function(ctx, win, com, rect){
        var
        ts = this.tileSet,
        tw = this.tileWidth,
        th = this.tileHeight,
        job = this.hero.getJob(),
        sd = this.smallDevice,
        gs = win.gridSize,
        margin = sd ? 2 : 4,
        pw = (rect.width - gs*2 - margin*2)/2,
        textWidth3 = sd ? 15 : 30,
        textWidth2 = sd ? 15 : 30,
        x = rect.x + gs + margin,
        y = rect.y + margin,
        uiSize = sd ? 16 : 32,
        i, l;

        ctx.save();
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.font = com.font;
        ctx.fillStyle = com.fontColor;

        switch(info[1]){
            case G_OBJECT_TYPE.CREEP:

                ctx.fillText(G_OBJECT_NAME[info[0]]+' ('+G_CREEP_TYPE_NAME[info[2]]+')', x, y + uiSize/2, rect.width);

                x = rect.x + gs + margin;
                y += uiSize;
                uiSize = sd ? 8 : 16;
                
                // draw hp
                for(i=0, l=info[3]; i<l; i++){
                    ts.draw(ctx, G_UI.HP, x, y, uiSize, uiSize);
                    x += uiSize;
                }

                x = rect.x + gs + margin + pw;
                y = rect.y + margin;
                uiSize = sd ? 16 : 32;
                
                x = me.drawData(ctx, ts, G_UI.PATK, info[4], x, y, uiSize, margin, textWidth3);
                x = me.drawData(ctx, ts, G_UI.RATK, info[5], x, y, uiSize, margin, textWidth3);
                x = me.drawData(ctx, ts, G_UI.MATK, info[6], x, y, uiSize, margin, textWidth3);

                x = rect.x + gs + margin + pw;
                y += uiSize;

                x = me.drawData(ctx, ts, G_UI.PDEF, info[7], x, y, uiSize, margin, textWidth3);
                x = me.drawData(ctx, ts, G_UI.MDEF, info[8], x, y, uiSize, margin, textWidth3);
                break;
            default:
                ts.draw(ctx, info[0], x, y, tw, th);
                ctx.fillText(G_OBJECT_NAME[info[0]], x + tw + margin, y + th/2);
                break;
        }

        ctx.restore();
    },
    drawBig = function(ctx, win, com, rect){
        var
        ts = this.tileSet,
        tw = this.tileWidth,
        th = this.tileHeight,
        gs = win.gridSize,
        x = rect.x + gs + 8,
        y = rect.y + gs + 8;

        ctx.save();
        ts.draw(ctx, info[0], x, y, tw, th);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.font = com.font;
        ctx.fillStyle = com.fontColor;
        ctx.fillText(G_OBJECT_NAME[info[0]], x + tw/2, y + th, rect.width);
        ctx.restore();
    };

    me.create = function(ent, data){
        data.font = this.smallDevice ? data.fontSmall : data.fontBig;
        return data;
    };

    me.open = function(elapsed, evt, entities){
        this.showEntity(G_WIN_ID.INFO);
        info = evt;
        return entities;
    };

    me.close = function(elapsed, evt, entities){
        this.hideEntity(G_WIN_ID.INFO);
        info = undefined;
        return entities;
    };

    me.openIfValid = function(elapsed, evt, entities){
        if (info){
            return me.open.call(this, elapsed, info, entities);
        }else{
            return me.close.call(this, elapsed, info, entities);
        }
    };

    me.draw = function(ctx, ent, clip){
        if (!info){
            me.close.call(this);
            return;
        }
        var
        com = ent.getComponent(name),
        win = ent.getComponent(com.win),
        rect = ent.getComponent(win.box);

        if (rect.height > (this.tileWidth * 3)){
            return drawBig.call(this, ctx, win, com, rect);
        }else{
            return drawSmall.call(this, ctx, win, com, rect);
        }
    };
});
