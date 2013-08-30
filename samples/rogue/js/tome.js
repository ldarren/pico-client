pico.def('tome', 'picUIWindow', function(){
    var
    me = this,
    name = me.moduleName,
    inventoryId = G_WIN_ID.BAG,
    skillsId = G_WIN_ID.SKILLS,
    draw = function(ctx, items, layout, com){
        var
        ts = this.tileSet,
        tw = this.tileWidth,
        th = this.tileHeight,
        activated = com.activated,
        block, item;

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = com.font;
        ctx.fillStyle = com.fontColor;

        block = layout[0];
        ctx.fillText(com.name, block[0]+block[2]/2, block[1]+block[3]/2, block[2]);
        
        for(var i=1,j=0, l=layout.length; i<l; i++,j++){
            block = layout[i];
            ts.draw(ctx, G_UI.SLOT, block[0], block[1], tw, th);
            item = items[j];
            if (!item) continue;
            ts.draw(ctx, item[0], block[0], block[1], tw, th);
            if (activated[i]) ts.draw(ctx, G_SHADE[0], block[0], block[1], tw, th);
        }

        ctx.restore();
    };

    me.create = function(ent, data){
        data.layouts = [];
        data.activated = [];
        data.font = this.smallDevice ? data.fontSmall : data.fontBig;
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

            switch(e.name){
                case skillsId:
                    wLay = win.layouts[0];
                    layout = me.generateGridLayout([wLay[0]+gs, wLay[1]+16+gs, wLay[2]-gs, wLay[3]-16-gs*2], tw, th, 4, 1);
                    layout.unshift([wLay[0]+gs, wLay[1]+gs, wLay[2]-gs, 16]);
                    layouts.push(layout);
                    wLay = win.layouts[1];
                    layout = me.generateGridLayout([wLay[0]+gs*2, wLay[1]+32+gs*2, wLay[2]-gs*4, wLay[3]-32-gs*4], tw, th, 4, 4);
                    layout.unshift([wLay[0]+gs*2, wLay[1]+gs*2, wLay[2]-gs*4, 32]);
                    layouts.push(layout);
                    break;
                case inventoryId:
                    wLay = win.layouts[0];
                    layout = me.generateGridLayout([wLay[0], wLay[1]+16+gs, wLay[2]-gs, wLay[3]-16-gs*2], tw, th, 4, 1);
                    layout.unshift([wLay[0], wLay[1]+gs, wLay[2]-gs, 16]);
                    layouts.push(layout);
                    wLay = win.layouts[1];
                    layout = me.generateGridLayout([wLay[0]+gs*2, wLay[1]+32+gs*2, wLay[2]-gs*4, wLay[3]-32-gs*4], tw, th, 4, 6);
                    layout.unshift([wLay[0]+gs*2, wLay[1]+gs*2, wLay[2]-gs*4, 32]);
                    layouts.push(layout);
                    break;
            }
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
        win = e.getComponent(com.win),
        rect = e.getComponent(win.box),
        layout = (rect.width > (tw * 3)) ? com.layouts[1] : com.layouts[0],
        x = evt[0],
        y = evt[1],
        tile, tx, ty;


        for(var j=1,jl=layout.length; j<jl; j++){
            tile = layout[j];
            tx = tile[0];
            ty = tile[1];
            if (tx < x && (tx + tw) > x && ty < y && (ty + th) > y){
                this.go('castSpell', {bag:e.name, index:j-1});
                return;
            }
        }
        return entities;
    };

    me.castSpell = function(elapsed, evt, entities){
        var
        targetName = evt.bag,
        e, com;
        for(var i=0,l=entities.length; i<l; i++){
            e = entities[i];
            if (targetName === e.name){
                com = e.getComponent(name);
                if (!com) continue;
                switch(targetName){
                    case inventoryId:
                        var items = this.hero.getBag();
                        if (items[evt.index]){
                            if(com.activated[evt.index+1] ^= true){
                            }else{
                            }
                            return [e];
                        }
                        break;
                    case skillsId:
                        var
                        hero = this.hero,
                        items = hero.getTome();
                        if (items[evt.index]){
                            if(com.activated[evt.index+1] ^= true){
                                hero.selectSpell(items[evt.index]);
                            }else{
                                hero.selectSpell(undefined);
                            }
                            return entities;
                        }
                        break;
                }
            }
        }
    };

    me.draw = function(ctx, ent, clip){
        var
        com = ent.getComponent(name),
        win = ent.getComponent(com.win),
        rect = ent.getComponent(win.box),
        hero = this.hero,
        items = ent.name === inventoryId ? hero.getBag() : hero.getTome();

        if (rect.width > (this.tileWidth * 3)){
            return drawBag.call(this, ctx, items, com.layouts[1], com);
        }else{
            return drawBag.call(this, ctx, items, com.layouts[0], com);
        }
    };
});
