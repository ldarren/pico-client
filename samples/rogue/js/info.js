pico.def('info', 'picUIWindow', function(){
    this.use('uiWindow');

    var
    me = this,
    Floor = Math.floor, Ceil = Math.ceil, Round = Math.round, Random = Math.random,
    name = me.moduleName,
    layouts = [],
    labels = [],
    callbacks = [],
    targetId, target,
    drawSmall = function(ctx, win, com, rect){
        var
        ts = this.tileSet,
        tw = this.tileWidth,
        th = this.tileHeight,
        sd = this.smallDevice,
        ai = this.ai,
        gs = win.gridSize,
        margin = sd ? 2 : 4,
        pw = (rect.width - gs*2 - margin*2)/2,
        textWidth3 = sd ? 15 : 30,
        textWidth2 = sd ? 15 : 30,
        x = rect.x + gs + margin,
        y = rect.y + margin,
        uiSize = sd ? 16 : 32,
        i, l;

        ctx.save();

        if (targetId > -1){
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.font = com.font;
            ctx.fillStyle = com.fontColor;

            switch(target[OBJECT_TYPE]){
                case G_OBJECT_TYPE.CREEP:

                    var stat = ai.getStatByObject(target);

                    ctx.fillText(target[OBJECT_NAME]+' ('+G_CREEP_TYPE_NAME[target[OBJECT_SUB_TYPE]]+')', x, y + uiSize/2, rect.width);

                    x = rect.x + gs + margin;
                    y += uiSize;
                    uiSize = sd ? 16 : 32;
 
                    x = me.drawData(ctx, ts, G_UI.PATK, target[CREEP_ATK], x, y, uiSize, margin, textWidth3);
                    x = me.drawData(ctx, ts, G_UI.RATK, target[CREEP_RATK], x, y, uiSize, margin, textWidth3);
                    x = me.drawData(ctx, ts, G_UI.MATK, target[CREEP_MATK], x, y, uiSize, margin, textWidth3);

                    x = rect.x + gs + margin + pw;
                    uiSize = sd ? 8 : 16;
                    y = rect.y + uiSize;
                    
                    // draw hp
                    for(i=0, l=stat[CREEP_HP]; i<l; i++){
                        ts.draw(ctx, i<target[CREEP_HP] ? G_UI.HP : G_UI.HP_EMPTY, x, y, uiSize, uiSize);
                        x += uiSize;
                    }

                    x = rect.x + gs + margin + pw;
                    y += uiSize + margin;
                    uiSize = sd ? 16 : 32;

                    x = me.drawData(ctx, ts, G_UI.PDEF, target[CREEP_DEF], x, y, uiSize, margin, textWidth3);
                    x = me.drawData(ctx, ts, G_UI.MDEF, target[CREEP_MDEF], x, y, uiSize, margin, textWidth3);
                    break;
                default:
                    ts.draw(ctx, target[OBJECT_ICON], x, y, tw, th);
                    ctx.fillText(target[OBJECT_NAME], x + tw + margin, y + th/2);
                    break;
            }

            me.drawButtons(ctx, layouts, labels, com.fontColor, G_COLOR_TONE[2], G_COLOR_TONE[1]);
        }else{
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.font = com.font;
            ctx.fillStyle = com.fontColor;

            me.fillWrapText(ctx, target, x, y, pw*2, 20);
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
        if(targetId > -1){
            ts.draw(ctx, target[OBJECT_ICON], x, y, tw, th);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.font = com.font;
            ctx.fillStyle = com.fontColor;
            ctx.fillText(target[OBJECT_NAME], x + tw/2, y + th, rect.width);

            me.drawButtons(ctx, layouts, labels, com.fontColor, G_COLOR_TONE[2], G_COLOR_TONE[1]);
        }else{
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.font = com.font;
            ctx.fillStyle = com.fontColor;

            me.fillWrapText(ctx, target, x, y, rect.width - gs*2 - 16, 20);
        }
        ctx.restore();
    };

    me.create = function(ent, data){
        data.font = this.smallDevice ? data.fontSmall : data.fontBig;
        return data;
    };

    me.open = function(elapsed, evt, entities){
        if (!evt) return;

        var ent = this.showEntity(G_WIN_ID.INFO);
        
        labels.length = 0;
        callbacks.length = 0;
        if (evt.labels) labels = evt.labels;
        if (evt.callbacks) callbacks = evt.callbacks;

        if (evt.info){
            targetId = -1;
            target = evt.info;
        }else{
            targetId = evt.targetId;
            target = this.objects[targetId];
        }

        return me.resize.call(this, elapsed, evt, entities);
    };

    me.close = function(elapsed, evt, entities){
        this.hideEntity(G_WIN_ID.INFO);
        labels.length = 0;
        callbacks.length = 0;
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
        btn, callback;

        for(var i=0, l=layouts.length; i<l; i++){
            btn = layouts[i];
            if (x > btn[0] && x < btn[0]+btn[2] && y > btn[1] && y < btn[1]+btn[3]){
                callback = callbacks[i];
                break;
            }
        }

        var
        hero = this.hero,
        ai = this.ai;

        switch(callback){
            case 'fight':
                this.go('attack', hero.battle(targetId, false));
                break;
            case 'flee':
                this.go('flee');
                break;
            case 'open':
                this.go('openChest', targetId);
                break;
            case 'speak':
                break;
            case 'use':
                delete this.objects[targetId];
                hero.incrHp(1);
                ai.incrHpAll(1);
                this.go('heroMoveTo', [targetId]);
                break;
            case 'inspect':
                break;
            case 'move':
                this.go('heroMoveTo', [this.nextTile(targetId, hero.getPosition())]);
                break;
            default:
                return entities;
        }
        me.uiWindow.showAll.call(this, elapsed, evt, entities);
        this.go('hideInfo');

        return;
    };

    me.resize = function(elapsed, evt, entities){

        layouts.length = 0;

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

        if (0 === labels.length){
            if (this.nearToHero(targetId)){
                switch(target[OBJECT_TYPE]){
                    case G_OBJECT_TYPE.CREEP:
                        labels.push('Fight');
                        callbacks.push('fight');
                        if (this.hero.isTarget(targetId)){
                            labels.push('Flee');
                            callbacks.push('flee');
                        }
                        break;
                    case G_OBJECT_TYPE.CHEST:
                        labels.push('Open');
                        callbacks.push('open');
                        break;
                    case G_OBJECT_TYPE.NPC:
                        labels.push('Speak');
                        callbacks.push('speak');
                        break;
                    case G_OBJECT_TYPE.HEALTH:
                        labels.push('Use');
                        callbacks.push('use');
                        break;
                    case G_OBJECT_TYPE.ENV:
                        labels.push('Inspect');
                        callbacks.push('inspect');
                        break;
                }
            }else{
                labels.push('Move');
                callbacks.push('move');
            }
        }

        var btnCount = labels.length;
        if (!btnCount) return entities;

       // if (win.maximized){
            var
            btnW = tileW*2, btnH = tileH,
            gap = Floor((rectW - btnW * btnCount - gs)/(btnCount+1)),
            y = rect.y + rectH - gs - btnH;

            for(var i=0; i<btnCount; i++){
                layouts.push([rect.x + gap + gs + i * (btnW+gap), y, btnW, btnH]);
            }
        /*}else{
            var
            btnW = tileW, btnH = tileH/2,
            gap = Floor((rectH - btnH * btnCount - gs)/(btnCount+1)),
            x = rect.x + rectW - gs - btnW;

            for(var i=0; i<btnCount; i++){
                layouts.push([x, rect.y + gap + i * (btnH+gap), btnW, btnH]);
            }
        }*/

        return entities;
    };

    me.draw = function(ctx, ent, clip){
        if (undefined === targetId){
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
