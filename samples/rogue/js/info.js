pico.def('info', 'picUIWindow', function(){
    var
    me = this,
    Floor = Math.floor, Ceil = Math.ceil, Round = Math.round, Random = Math.random,
    name = me.moduleName,
    layouts = [],
    labels = [],
    targetId, target,
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

        if (target){
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.font = com.font;
            ctx.fillStyle = com.fontColor;

            switch(target[1]){
                case G_OBJECT_TYPE.CREEP:

                    var stat = G_CREEP_STAT[target[0]-G_CREEP.RAT];

                    ctx.fillText(G_OBJECT_NAME[target[0]]+' ('+G_CREEP_TYPE_NAME[target[2]]+')', x, y + uiSize/2, rect.width);

                    x = rect.x + gs + margin;
                    y += uiSize;
                    uiSize = sd ? 8 : 16;
                    
                    // draw hp
                    for(i=0, l=stat[3]; i<l; i++){
                        ts.draw(ctx, i<target[3] ? G_UI.HP : G_UI.HP_EMPTY, x, y, uiSize, uiSize);
                        x += uiSize;
                    }

                    x = rect.x + gs + margin + pw;
                    y = rect.y + margin;
                    uiSize = sd ? 16 : 32;
                    
                    x = me.drawData(ctx, ts, G_UI.PATK, target[4], x, y, uiSize, margin, textWidth3);
                    x = me.drawData(ctx, ts, G_UI.RATK, target[5], x, y, uiSize, margin, textWidth3);
                    x = me.drawData(ctx, ts, G_UI.MATK, target[6], x, y, uiSize, margin, textWidth3);

                    x = rect.x + gs + margin + pw;
                    y += uiSize;

                    x = me.drawData(ctx, ts, G_UI.PDEF, target[7], x, y, uiSize, margin, textWidth3);
                    x = me.drawData(ctx, ts, G_UI.MDEF, target[8], x, y, uiSize, margin, textWidth3);
                    break;
                default:
                    ts.draw(ctx, target[0], x, y, tw, th);
                    ctx.fillText(G_OBJECT_NAME[target[0]], x + tw + margin, y + th/2);
                    break;
            }

            me.drawButtons(ctx, layouts, labels, com.fontColor, G_COLOR_TONE[2], G_COLOR_TONE[1]);
        }else{
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.font = com.font;
            ctx.fillStyle = com.fontColor;

            me.fillWrapText(ctx, targetId, x, y, pw*3, 20);
        }
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
        if(target){
            ts.draw(ctx, target[0], x, y, tw, th);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.font = com.font;
            ctx.fillStyle = com.fontColor;
            ctx.fillText(G_OBJECT_NAME[target[0]], x + tw/2, y + th, rect.width);

            me.drawButtons(ctx, layouts, labels, com.fontColor, G_COLOR_TONE[2], G_COLOR_TONE[1]);
        }else{
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.font = com.font;
            ctx.fillStyle = com.fontColor;

            me.fillWrapText(ctx, targetId, x, y, rect.width - gs*2 - 16, 20);
        }
        ctx.restore();
    };

    me.create = function(ent, data){
        data.font = this.smallDevice ? data.fontSmall : data.fontBig;
        return data;
    };

    me.open = function(elapsed, evt, entities){
        var ent = this.showEntity(G_WIN_ID.INFO);

        if (typeof evt === 'string'){
            targetId = evt;
            target = undefined;
        }else{
            targetId = evt;
            target = this.objects[targetId];
        }

        return me.resize.call(this, elapsed, evt, entities);
    };

    me.close = function(elapsed, evt, entities){
        this.hideEntity(G_WIN_ID.INFO);
        targetId = target = undefined;
        return entities;
    };

    me.openIfValid = function(elapsed, evt, entities){
        if (targetId){
            return me.open.call(this, elapsed, targetId, entities);
        }else{
            return me.close.call(this, elapsed, targetId, entities);
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

        var
        hero = this.hero;

        switch(label){
            case 'Fight':
                this.go('attack', hero.battle(targetId, false));
                break;
            case 'Flee':
                break;
            case 'Open':
                break;
            case 'Speak':
                break;
            case 'Use':
                delete this.objects[targetId];
                hero.incrHp(1);
                var 
                hp = hero.getPosition(),
                h = this.findPath(hp, targetId);
                if (h.length){
                    this.stopLoop('heroMove');
                    this.startLoop('heroMove', h);
                }
                break;
            case 'Inspect':
                break;
            case 'Move':
                var
                hp = hero.getPosition(),
                h = this.findPath(hp, this.nextTile(targetId, hp));
                if (h.length){
                    this.stopLoop('heroMove');
                    this.startLoop('heroMove', h);
                }
                break;
            default:
                return entities;
        }
        this.go('hideInfo');

        return;
    };

    me.resize = function(elapsed, evt, entities){

        layouts.length = 0;
        labels.length = 0;

        if (!target) return entities;
        var ent = me.findMyFirstEntity(entities, name);
        if (!ent) return entities;

        var
        com = ent.getComponent(name),
        win = ent.getComponent(com.win),
        gs = win.gridSize,
        rect = ent.getComponent(win.box),
        rectW = rect.width,
        rectH = rect.height,
        tileW = this.tileWidth,
        tileH = this.tileHeight;

        if (this.nearToHero(targetId)){
            switch(target[1]){
                case G_OBJECT_TYPE.CREEP:
                    labels.push('Fight');
                    if (this.hero.isTarget(targetId)) labels.push('Flee');
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
        }else{
            labels.push('Move');
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
        if (!targetId){
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
