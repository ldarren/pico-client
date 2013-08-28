pico.def('info', 'picUIWindow', function(){
    var
    me = this,
    name = me.moduleName,
    info,
    drawSmall = function(ctx, win, com, rect){
        var
        ts = this.tileSet,
        center = rect.y + (rect.height-win.gridSize)/2,
        tw = this.tileWidth,
        th = this.tileHeight,
        x = rect.x + win.gridSize + 8,
        y = center - (th/2);

        ctx.save();
        ts.draw(ctx, info.creepId, x, y, tw, th);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.font = com.font;
        ctx.fillStyle = com.fontColor;
        ctx.fillText(G_OBJECT_NAME[info.creepId], x + tw + 8, center, rect.width);
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
        ts.draw(ctx, info.creepId, x, y, tw, th);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.font = com.font;
        ctx.fillStyle = com.fontColor;
        ctx.fillText(G_OBJECT_NAME[info.creepId], x + tw/2, y + th, rect.width);
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
