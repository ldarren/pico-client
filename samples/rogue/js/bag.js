pico.def('bag', 'picUIWindow', function(){
    var
    me = this,
    Floor = Math.floor, Ceil = Math.ceil, Random = Math.random, Round = Math.round,
    BAG_ROW = 4,
    name = me.moduleName,
    inventoryId = G_WIN_ID.BAG,
    draw = function(ctx, slots, layout, com){
        var
        ts = this.tileSet,
        tw = this.tileWidth,
        th = this.tileHeight,
        activated = com.activated,
        block, slot, item, count;

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = com.font;
        ctx.fillStyle = com.fontColor;

        block = layout[0];
        ctx.fillText(com.name, block[0]+block[2]/2, block[1]+block[3]/2, block[2]);
        
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        for(var i=1,j=0, l=layout.length; i<l; i++,j++){
            block = layout[i];
            ts.draw(ctx, G_UI.SLOT, block[0], block[1], tw, th);
            slot = slots[j];
            if (!slot) continue;
            item = slot[0];
            count = slot[1];
            ts.draw(ctx, item[0], block[0], block[1], tw, th);
            if(count > 1)  ctx.fillText(count, block[0]+tw, block[1]+th, tw);
        }
        if (activated) {
            block = layout[activated];
            ts.draw(ctx, G_SHADE[0], block[0], block[1], tw, th);
        }

        ctx.restore();
    };

    me.create = function(ent, data){
        data.layouts = [];
        data.forSale = false;
        data.activated;
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
            cap = this.hero.getBagCap(),
            wLay, layout;

            layouts.length = 0;

            wLay = win.layouts[0];
            layout = me.generateGridLayout([wLay[0], wLay[1]+20+gs, wLay[2]-gs, wLay[3]-20-gs*2], tw, th, BAG_ROW, 1);
            layout.unshift([wLay[0], wLay[1]+gs, wLay[2]-gs, 20]);
            layouts.push(layout);
            wLay = win.layouts[1];
            layout = me.generateGridLayout([wLay[0]+gs*2, wLay[1]+32+gs*2, wLay[2]-gs*4, wLay[3]-32-gs*4], tw, th, BAG_ROW, Floor(cap/BAG_ROW));
            layout.unshift([wLay[0]+gs*2, wLay[1]+gs*2, wLay[2]-gs*4, 32]);
            layouts.push(layout);
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
        bag = this.hero.getBag(),
        win = e.getComponent(com.win),
        layout = (win.maximized) ? com.layouts[1] : com.layouts[0],
        x = evt[0],
        y = evt[1],
        tile, tx, ty;

        for(var i=0,j=1,jl=layout.length; j<jl; i++,j++){
            tile = layout[j];
            tx = tile[0];
            ty = tile[1];
            if (tx < x && (tx + tw) > x && ty < y && (ty + th) > y){
                if (bag[i]){
                    com.activated = j;
                    this.go('showInfo', {targetId: i, context: com.forSale ? G_CONTEXT.MERCHANT_SALE : G_CONTEXT.BAG});
                }
                return;
            }
        }
        com.forSale = false; // click on bag but on the window
        return entities;
    };

    me.openForSale = function(elapsed, evt, entities){
        var ent = me.findHost(entities, G_WIN_ID.BAG);
        if (!ent) return entities;
        var com = ent.getComponent(name);
        com.forSale = true;
        return [ent];
    };

    me.useItem = function(elapsed, evt, entities){
        var
        targetName = evt.bag,
        e, com;
        for(var i=0,l=entities.length; i<l; i++){
            e = entities[i];
            if (targetName === e.name){
                com = e.getComponent(name);
                if (!com) continue;

                var items = this.hero.getBag();
                if (items[evt.index]){
                    return [e];
                }
            }
        }
    };

    me.lootItem = function(elapsed, evt, entities){
        var
        object = this.objects[evt],
        loot = object[CHEST_ITEM];

        if (!loot) return;

        this.hero.putIntoBag(loot);

        var empty = G_OBJECT[G_ICON.CHEST_EMPTY].slice();
        empty[OBJECT_NAME] = G_OBJECT_NAME[empty[OBJECT_ICON]];
        this.objects[evt] = empty;

        return entities;
    };

    me.draw = function(ctx, ent, clip){
        var
        com = ent.getComponent(name),
        win = ent.getComponent(com.win),
        rect = ent.getComponent(win.box);

        return draw.call(this, ctx, this.hero.getBag(), com.layouts[win.maximized], com);
    };
});
