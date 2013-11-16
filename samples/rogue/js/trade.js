pico.def('trade', 'picUIContent', function(){
    var
    me = this,
    Floor = Math.floor, Ceil = Math.ceil, Round = Math.round, Random = Math.random,
    name = me.moduleName,
    TRADE_ROW = 4, TRADE_COL = 4,
    screenSize = [],
    layouts = [],
    labels = ['Close'],
    goods = undefined;

    me.create = function(ent, data){
        data.font = this.smallDevice ? data.fontSmall : data.fontBig;

        return data;
    };

    me.open = function(elapsed, evt, entities){
        var ent = this.showEntity(G_WIN_ID.TRADE);
        if (!ent) {
            ent = me.findHostByCom(entities, name);
        }
        if (!ent) return;

        goods = evt;
        layouts.length = 0;

        var 
        com = ent.getComponent(name),
        rect = ent.getComponent(com.box),
        btnCount = labels.length;

        rect.width = com.minWidth;
        rect.height = com.minHeight;
        rect.x = screenSize[0] + (screenSize[2] - rect.width)/2;
        rect.y = screenSize[1] + (screenSize[3] - rect.height)/2;

        var
        th = this.tileHeight,
        tw = this.tileWidth,
        btnH = this.smallDevice ? 16 : 32, 
        btnW = Round(rect.width/btnCount),
        marginX = Floor((rect.width - tw * TRADE_COL)/(TRADE_COL+1)),
        marginY = Floor(th/2),
        y = rect.y;

        y += btnH;

        layouts = me.generateGridLayout([rect.x+marginX, y+marginY, rect.width-marginX*2, (marginY+th)*TRADE_ROW-marginY], tw, th, TRADE_ROW, TRADE_COL);
        layouts.unshift([rect.x, rect.y, rect.width, btnH]);

        y += marginY+(marginY+th)*TRADE_ROW;
        layouts.push([rect.x, y, btnW, btnH]);

        rect.height = y + btnH - rect.y;

        return [ent];
    };

    me.close = function(elapsed, evt, entities){
        var e = me.findHost(entities, G_WIN_ID.TRADE);
        if (e){
            this.hideEntity(G_WIN_ID.TRADE);
            goods = undefined;
            return [e];
        }
        return entities;
    };

    me.openIfValid = function(elapsed, evt, entities){
        if (goods){
            me.open.call(this, elapsed, goods, entities);
        }else{
            me.close.call(this, elapsed, goods, entities);
        }
        return entities;
    };

    me.resize = function(elapsed, evt, entities){

        screenSize = evt.slice();
        me.openIfValid.call(this, elapsed, evt, entities);

        return entities;
    };

    me.click = function(elapsed, evt, entities){
        if (!goods) return entities;
        var 
        e = entities[0],
        com = e.getComponent(name);

        if (!com) return entities;

        if (layouts.length){
            var
            x = evt[0],
            y = evt[1],
            btn;
            for(var i=0, l=layouts.length; i<l; i++){
                btn = layouts[i];
                if (x > btn[0] && x < btn[0]+btn[2] && y > btn[1] && y < btn[1]+btn[3]){
                    this.go('hideTrade');
                    break;
                }
            }
        }
        return;
    };

    me.draw = function(ctx, ent, clip){
        if (!goods){
            me.close.call(this);
            return;
        }

        var
        com = ent.getComponent(name),
        rect = ent.getComponent(com.box),
        rectW = rect.width,
        ts = this.tileSet,
        tw = this.tileWidth,
        th = this.tileHeight,
        x = rect.x,
        y = rect.y,
        fontColor = G_COLOR_TONE[1],
        i, j, l, block;

        ctx.save();

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = com.font;
        ctx.fillStyle = fontColor;

        block = layouts[0];
        ctx.fillText('Trade', block[0]+(block[2])/2, block[1]+(block[3])/2, block[3]);

        for(i=1,j=0, l=layouts.length-1; i<l; i++,j++){
            block = layouts[i];
            ts.draw(ctx, G_UI.SLOT, block[0], block[1], tw, th);
            slot = goods[j];
            if (!slot) continue;
            ts.draw(ctx, slot[OBJECT_ICON], block[0], block[1], tw, th);
        }

        // draw buttons
        me.drawButtons(ctx, [layouts[layouts.length-1]], labels, fontColor, G_COLOR_TONE[3], G_COLOR_TONE[3]);

        ctx.restore();
    };
});
