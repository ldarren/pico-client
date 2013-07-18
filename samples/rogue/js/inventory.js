pico.def('inventory', 'picUIWindow', function(){
    var
    me = this,
    name = me.moduleName,
    draw = function(ctx, layout, font, fontColor){
        var
        ts = this.tileSet,
        tw = this.tileWidth,
        th = this.tileHeight,
        block;

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = font;
        ctx.fillStyle = fontColor;

        block = layout[0];
        ctx.fillText('Bag', block[0]+block[2]/2, block[1]+block[3]/2, block[2]);
        
        for(var i=1, l=layout.length; i<l; i++){
            block = layout[i];
            ts.draw(ctx, G_UI.SLOT, block[0], block[1], tw, th);
        }

        ctx.restore();
    };

    me.create = function(ent, data){
        data.layouts = [];
        return data;
    };

    me.resize = function(elapsed, evt, entities){
        var
        tw = this.tileWidth, th = this.tileHeight,
        e, com, win, wLay, layouts, gs;

        for(var i=0, l=entities.length; i<l; i++){
            e = entities[i];
            com = e.getComponent(name);
            if (!com) continue;
            layouts = com.layouts;
            layouts.length = 0;
            win = e.getComponent(com.win);
            gs = win.gridSize;

            wLay = win.layouts[0];
            layout = me.generateGridLayout([wLay[0], wLay[1]+16+gs, wLay[2]-gs, wLay[3]-16-gs*2], tw, th, 4, 1);
            layout.unshift([wLay[0], wLay[1]+gs, wLay[2]-gs, 16]);
            layouts.push(layout);
            wLay = win.layouts[1];
            layout = me.generateGridLayout([wLay[0]+gs*2, wLay[1]+32+gs*2, wLay[2]-gs*4, wLay[3]-32-gs*4], tw, th, 4, 6);
            layout.unshift([wLay[0]+gs*2, wLay[1]+gs*2, wLay[2]-gs*4, 32]);
            layouts.push(layout);
        }
        return entities;
    };

    me.draw = function(ctx, ent, clip){
        var
        com = ent.getComponent(name),
        win = ent.getComponent(com.win),
        rect = ent.getComponent(win.box);

        if (rect.width > (this.tileWidth * 3)){
            return draw.call(this, ctx, com.layouts[1], com.font, com.fontColor);
        }else{
            return draw.call(this, ctx, com.layouts[0], com.font, com.fontColor);
        }
    };
});
