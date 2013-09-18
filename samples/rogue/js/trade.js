pico.def('trade', 'picUIWindow', function(){
    var
    me = this,
    Floor = Math.floor, Ceil = Math.ceil, Round = Math.round, Random = Math.random,
    name = me.moduleName,
    screenSize = [],
    layouts = [],
    labels = ['Close'],
    goods = undefined;

    me.create = function(ent, data){
        var ts = this.tileSet;
        ts.assignPatternImg(data.background, ts.cut(data.background, this.tileWidth, this.tileHeight));

        data.font = this.smallDevice ? data.fontSmall : data.fontBig;

        data.minWidth = this.smallDevice ? 320 : 640;
        data.minHeight = this.smallDevice ? 180 : 360;
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
        btnH = this.smallDevice ? 16 : 32, 
        btnW = Round(rect.width/btnCount),
        y = rect.y + rect.height - btnH;

        for(var i=0; i<1; i++){
            layouts.push([rect.x + i * (btnW), y, btnW, btnH]);
        }

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

    me.checkBound = function(elapsed, evt, entities){
        return entities;
    };

    me.click = function(elapsed, evt, entities){
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
        i, l;

        ctx.save();

        ctx.fillStyle = 'rgba(32,70,49,0.7)';
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
        ts.fillPattern(ctx, com.background, rect.x, rect.y, rect.width, rect.height);

        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.font = com.font;
        ctx.fillStyle = fontColor;

        // draw buttons
        me.drawButtons(ctx, layouts, labels, fontColor, G_COLOR_TONE[3], G_COLOR_TONE[3]);

        ctx.restore();
    };
});
