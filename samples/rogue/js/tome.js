pico.def('tome', 'picUIWindow', function(){
    var
    me = this,
    Floor = Math.floor, Ceil = Math.ceil, Random = Math.random, Round = Math.random,
    TOME_ROW = 4,
    name = me.moduleName,
    tomeId = G_WIN_ID.TOME,
    draw = function(ctx, items, layout, com){
        var
        ts = this.tileSet,
        tw = this.tileWidth,
        th = this.tileHeight,
        sd = this.smallDevice,
        fw = sd ? 8 : 16,
        fh = sd ? 16 : 32,
        fx = (tw - fw)/2,
        fy = (th - fh)/2,
        selectedSpell = this.hero.getSelectedSpell(),
        block, item, x, y;

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = com.font;
        ctx.fillStyle = com.fontColor;

        block = layout[0];
        ctx.fillText(com.name, block[0]+block[2]/2, block[1]+block[3]/2, block[2]);
        
        for(var i=1,j=0, l=layout.length; i<l; i++,j++){
            block = layout[i];
            x = block[0], y = block[1];
            ts.draw(ctx, G_UI.SLOT, x, y, tw, th);
            item = items[j];
            if (!item) continue;
            ts.draw(ctx, item[OBJECT_ICON], x, y, tw, th);
            if (item[SPELL_COOLDOWN]) ts.draw(ctx, G_NUMERIC.LARGE_LIGHT + item[SPELL_COOLDOWN], x+fx, y+fy, fw, fh);
            else if (item === selectedSpell) ts.draw(ctx, G_SHADE[0], x, y, tw, th);
        }

        ctx.restore();
    };

    me.create = function(ent, data){
        data.layouts = [];
        data.font = this.smallDevice ? data.fontSmall : data.fontBig;
        return data;
    };

    me.resize = function(elapsed, evt, entities){
        var e, com;

        for(var i=0, l=entities.length; i<l; i++){
            e = entities[i];
            com = e.getComponent(name);
            if (!com) continue;

            var
            tw = this.tileWidth, th = this.tileHeight,
            layouts = com.layouts,
            win = e.getComponent(com.win),
            gs = win.gridSize,
            wLay = win.layouts[0],
            cap = this.hero.getTomeCap(),
            layout;

            layouts.length = 0;

            layout = me.generateGridLayout([wLay[0]+gs, wLay[1]+16+gs, wLay[2]-gs, wLay[3]-16-gs*2], tw, th, TOME_ROW, 1);
            layout.unshift([wLay[0]+gs, wLay[1]+gs, wLay[2]-gs, 16]);
            layouts.push(layout);
            wLay = win.layouts[1];
            layout = me.generateGridLayout([wLay[0]+gs*2, wLay[1]+32+gs*2, wLay[2]-gs*4, wLay[3]-32-gs*4], tw, th, TOME_ROW, Floor(cap/TOME_ROW));
            layout.unshift([wLay[0]+gs*2, wLay[1]+gs*2, wLay[2]-gs*4, 32]);
            layouts.push(layout);

            break;
        }
        return entities;
    };

    me.click = function(elapsed, evt, entities){
        var
        e = entities[0],
        com = e.getComponent(name);

        if (!com) return entities;
        
        var
        tw = this.tileWidth,
        th = this.tileHeight,
        hero = this.hero,
        win = e.getComponent(com.win),
        rect = e.getComponent(win.box),
        layout = (rect.width > (tw * 3)) ? com.layouts[1] : com.layouts[0],
        x = evt[0],
        y = evt[1],
        tile, spell, tx, ty;

        for(var j=1,jl=layout.length; j<jl; j++){
            tile = layout[j];
            tx = tile[0];
            ty = tile[1];
            if (tx < x && (tx + tw) > x && ty < y && (ty + th) > y){
                spell = hero.getTome()[j-1];
                this.go('selectSpell', hero.getSelectedSpell() === spell ? undefined : spell); // call even if tome[j-1] is undefined
                return;
            }
        }
        return entities;
    };

    // use this so that all entities can be updated
    me.selectSpell = function(elapsed, evt, entities){
        var e, com;

        for(var i=0,l=entities.length; i<l; i++){
            e = entities[i];
            com = e.getComponent(name);
            if (!com) continue;

            this.hero.selectSpell(evt);

            return entities;
        }
    };

    me.draw = function(ctx, ent, clip){
        var
        com = ent.getComponent(name),
        win = ent.getComponent(com.win),
        rect = ent.getComponent(win.box);

        return draw.call(this, ctx, this.hero.getTome(), com.layouts[win.maximized], com);
    };
});
