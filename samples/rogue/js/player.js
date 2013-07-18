pico.def('player', 'picUIWindow', function(){
    var
    me = this,
    name = me.moduleName,
    drawSmall = function(ctx, win, com, rect){
        var
        ts = this.tileSet,
        center = rect.y + win.gridSize + (rect.height-win.gridSize)/2,
        tw = this.tileWidth,
        th = this.tileHeight,
        x = rect.x + win.gridSize + 8,
        y = center - (th/2);

        ctx.save();
        ts.draw(ctx, this.heroJob, x, y, tw, th);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.font = com.font;
        ctx.fillStyle = com.fontColor;
        ctx.fillText(G_HERO_CLASS[this.heroJob], x + tw + 8, center, rect.width);
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
        ts.draw(ctx, this.heroJob, x, y, tw, th);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.font = com.font;
        ctx.fillStyle = com.fontColor;
        ctx.fillText(G_HERO_CLASS[this.heroJob], x + tw/2, y + th, rect.width);
        ctx.restore();
    };

    me.draw = function(ctx, ent, clip){
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
