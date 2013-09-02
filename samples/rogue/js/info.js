pico.def('info', 'picUIWindow', function(){
    var
    me = this,
    Floor = Math.floor, Ceil = Math.ceil, Round = Math.round, Random = Math.random,
    name = me.moduleName,
    layouts = [],
    labels = [],
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
        pw = (rect.width - gs*2 - margin*2)/3,
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

        me.drawButtons(ctx, layouts, labels, com.fontColor, G_COLOR_TONE[2], G_COLOR_TONE[1]);

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

        me.drawButtons(ctx, layouts, labels, com.fontColor, G_COLOR_TONE[2], G_COLOR_TONE[1]);
        ctx.restore();
    };

    me.create = function(ent, data){
        data.font = this.smallDevice ? data.fontSmall : data.fontBig;
        return data;
    };

    me.open = function(elapsed, evt, entities){
        var ent = this.showEntity(G_WIN_ID.INFO);
        info = evt;

        return me.resize.call(this, elapsed, evt, entities);
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

    me.click = function(elapsed, evt, entities){
        if (!layouts.length) return entities;

        var 
        e = entities[0],
        com = e.getComponent(name);

        if (!com) return entities;

        var
        x = evt[0], y = evt[1],
        btn, label;

        for(var i=0, l=layouts.length; i<l; i++){
            btn = layouts[i];
            if (x > btn[0] && x < btn[0]+btn[2] && y > btn[1] && y < btn[1]+btn[3]){
                label = labels[i];
                break;
            }
        }

        switch(label){
            case 'Fight':
                break;
            case 'Flee':
                break;
            case 'Open':
                break;
            case 'Speak':
                break;
            case 'Use':
                break;
            case 'Inspect':
                break;
            default:
                return entities;
        }

        return;
    };

    me.resize = function(elapsed, evt, entities){
        var ent = me.findMyFirstEntity(entities, name);
        if (!ent) return entities;

        layouts.length = 0;
        labels.length = 0;

        var
        com = ent.getComponent(name),
        win = ent.getComponent(com.win),
        gs = win.gridSize,
        rect = ent.getComponent(win.box),
        rectW = rect.width,
        rectH = rect.height,
        tileW = this.tileWidth,
        tileH = this.tileHeight;

        switch(info[1]){
            case G_OBJECT_TYPE.CREEP:
                labels.push('Fight');
                if (this.hero.isTarget(info)) labels.push('Flee');
                break;
            case G_OBJECT_TYPE.CHEST:
                labels.push('Open');
                break;
            case G_OBJECT_TYPE.NPC:
                labels.push('Speak');
                break;
            case G_OBJECT_TYPE.HEALTH:
                labels.push('Use');
                break;
            case G_OBJECT_TYPE.ENV:
                labels.push('Inspect');
                break;
        }

        var btnCount = labels.length;
        if (!btnCount) return entities;

        if (win.maximized){
            var
            btnW = tileW*2, btnH = tileH,
            gap = Floor((rectW - btnW * btnCount - gs)/(btnCount+1)),
            y = rect.y + rectH - gs - btnH;

            for(var i=0; i<btnCount; i++){
                layouts.push([rect.x + gap + gs + i * (btnW+gap), y, btnW, btnH]);
            }
        }else{
            var
            btnW = tileW, btnH = tileH/2,
            gap = Floor((rectH - btnH * btnCount - gs)/(btnCount+1)),
            x = rect.x + rectW - gs - btnW;

            for(var i=0; i<btnCount; i++){
                layouts.push([x, rect.y + gap + i * (btnH+gap), btnW, btnH]);
            }
        }

        return entities;
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

        if (win.maximized){
            return drawBig.call(this, ctx, win, com, rect);
        }else{
            return drawSmall.call(this, ctx, win, com, rect);
        }
    };
});
