pico.def('info', 'picUIWindow', function(){
    var
    me = this,
    name = me.moduleName,
    rectName = 'picRect',
    info;

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

    me.checkInfo = function(elapsed, evt, entities){
        if (info){
            return me.open.call(this, elapsed, evt, entities);
        }else{
            return me.close.call(this, elapsed, evt, entities);
        }
    };

    me.draw = function(ctx, ent, clip){
        if (!info){
            me.close.call(this);
            return;
        }
        var rect = ent.getComponent(rectName);
        ctx.save();
        this.tileSet.draw(ctx, info.creepId, rect.x, rect.y, this.tileWidth, this.tileHeight);
        ctx.font = 'bold 12pt sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = G_COLOR_TONE[1];
        ctx.fillText(G_CREEP_NAME[info.creepId], rect.x + (this.tileWidth * 2), rect.y, rect.width);
        ctx.restore();
    };
});
