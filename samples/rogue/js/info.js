pico.def('info', 'picUIWindow', function(){
    this.use('uiWindow');

    var
    me = this,
    Floor = Math.floor, Ceil = Math.ceil, Round = Math.round, Random = Math.random,
    name = me.moduleName,
    screenSize = [],
    layouts = [],
    labels = [],
    callbacks = [],
    context = G_CONTEXT.WORLD,
    targetId, target,
    addOption = function(label, callback){
        labels.push(label);
        callbacks.push(callback);
    },
    addButtons = function(){
        if (!target || targetId < 0) return;

        labels.length = 0;

        switch(context){
            case G_CONTEXT.WORLD:
                if (this.nearToHero(targetId)){
                    switch(target[OBJECT_TYPE]){
                        case G_OBJECT_TYPE.CREEP:
                            addOption('Fight', 'fight');
                            if (this.hero.isTarget(targetId)){
                                addOption('Flee', 'flee');
                            }
                            break;
                        case G_OBJECT_TYPE.CHEST:
                            if (target[OBJECT_SUB_TYPE]){
                                if (target[CHEST_ITEM]){
                                    this.go('openChest', targetId);
                                    return;
                                }
                                addOption('Open', 'open');
                            }
                            break;
                        case G_OBJECT_TYPE.NPC:
                            switch(target[OBJECT_SUB_TYPE]){
                                case G_NPC_TYPE.BLACKSMITH:
                                    addOption('Buy Items', 'buyItems');
                                    addOption('Craft', 'craft');
                                    break;
                                case G_NPC_TYPE.ARCHMAGE:
                                    addOption('Buy', 'buy');
                                    addOption('Identify', 'identify');
                                    break;
                                case G_NPC_TYPE.TOWN_GUARD:
                                    addOption('Sale Items', 'saleItems');
                                    addOption('Gamble', 'gamble');
                                    break;
                            }
                            break;
                        case G_OBJECT_TYPE.HEALTH:
                            addOption('Consume', 'consume');
                            break;
                        case G_OBJECT_TYPE.ENV:
                            addOption('Inspect', 'inspect');
                            break;
                        case G_OBJECT_TYPE.KEY:
                            addOption('Unlock Gate', 'unlock');
                            addOption('Later');
                            break;
                    }
                }else{
                    addOption('Move', 'move');
                }
                break;
            case G_CONTEXT.BAG:
                var stat = target[0];
                switch(stat[OBJECT_TYPE]){
                    case G_OBJECT_TYPE.WEAPON:
                    case G_OBJECT_TYPE.AMMO:
                    case G_OBJECT_TYPE.ARMOR:
                    case G_OBJECT_TYPE.JEWEL:
                        addOption('Equip', 'equip');
                        addOption('Discard', 'discard');
                        break;
                    case G_OBJECT_TYPE.POTION:
                        addOption('Drink', 'drink');
                        addOption('Discard', 'discard');
                        break;
                    case G_OBJECT_TYPE.SCROLL:
                        addOption('Read', 'read');
                        addOption('Discard', 'discard');
                        break;
                    case G_OBJECT_TYPE.MATERIAL:
                        addOption('Discard', 'discard');
                        break;
                }
                break;
            case G_CONTEXT.TOME:
                addOption('Cast', 'cast');
                addOption('Forget', 'forget');
                break;
            case G_CONTEXT.MERCHANT_BUY:
                addOption('Buy', 'buy');
                break;
            case G_CONTEXT.MERCHANT_SALE:
                addOption('Sale', 'sale');
                break;
            case G_CONTEXT.CREEP_EFFECT:
                addOption('Details', 'details');
                break;
        }
    },
    createLayouts = function(left, bottom, width, smallDevice){
        layouts.length = 0;

        var btnCount = labels.length;
        if (btnCount < 1) return;

        var
        btnH = smallDevice ? 16 : 32, 
        btnW = Round(width/btnCount),
        y = bottom - btnH;

        for(var i=0; i<btnCount; i++){
            layouts.push([left + i * (btnW), y, btnW, btnH]);
        }
    };

    me.create = function(ent, data){
        var ts = this.tileSet;

        ts.assignPatternImg(data.background, ts.cut(data.background, this.tileWidth, this.tileHeight));

        data.font = this.smallDevice ? data.fontSmall : data.fontBig;
        return data;
    };

    me.open = function(elapsed, evt, entities){
        if (!evt) return;

        var ent = this.showEntity(G_WIN_ID.INFO);
        if (!ent){
            ent = me.findHostByCom(entities, name);
        }
        if (!ent) return;
        
        labels.length = 0;
        callbacks.length = 0;

        context = evt.context || G_CONTEXT.WORLD;

        if (evt.info){
            targetId = -1;
            target = evt.info;
        }else{
            targetId = evt.targetId;
            switch(context){
                case G_CONTEXT.BAG:
                    target = this.hero.getBag()[targetId];
                    break;
                case G_CONTEXT.TOME:
                    target = this.hero.getTome()[targetId];
                    break;
                default:
                    target = this.objects[targetId];
                    break;
            }
        }

        if (evt.callbacks) callbacks = evt.callbacks;
        if (evt.labels) labels = evt.labels;
        else addButtons.call(this);

        var
        com = ent.getComponent(name),
        rect = ent.getComponent(com.box);

        rect.x = screenSize[0];
        rect.y = screenSize[3]-160;
        rect.width = screenSize[2];
        rect.height = 160;

        createLayouts(rect.x, rect.y+rect.height, rect.width, this.smallDevice);
        
        return entities;
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
            case 'consume':
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
            case 'unlock':
                this.go('openGate', [targetId]);
                break;
            case 'buyItems':
                break;
            case 'saleItems':
                this.go('openForSale', [targetId]);
                break;
        }
        this.go('hideInfo');

        return;
    };

    me.resize = function(elapsed, evt, entities){

        screenSize = evt.slice();
        me.openIfValid.call(this, elapsed, evt, entities);

        return entities;
    };

    me.checkBound = function(elapsed, evt, entities){
        var
        x = evt[0], y = evt[1],
        unknowns = [],
        e, uiOpt, rectOpt;

        for (var i=0, l=entities.length; i<l; i++){
            e = entities[i];
            uiOpt = e.getComponent(name);
            if (!uiOpt) {
                unknowns.push(e);
                continue;
            }
            rectOpt = e.getComponent(uiOpt.box);
            if(rectOpt.x < x && (rectOpt.x + rectOpt.width) > x && rectOpt.y < y && (rectOpt.y + rectOpt.height) > y){
                return [e];
            }
        }

        return unknowns;
    };

    me.draw = function(ctx, ent, clip){
        if (undefined === targetId){
            me.close.call(this);
            return;
        }
        var
        com = ent.getComponent(name),
        rect = ent.getComponent(com.box),
        ts = this.tileSet,
        tw = this.tileWidth,
        th = this.tileHeight,
        sd = this.smallDevice,
        ai = this.ai,
        margin = sd ? 2 : 4,
        pw = (rect.width - margin*2)/2,
        textWidth3 = sd ? 15 : 30,
        textWidth2 = sd ? 15 : 30,
        x = X = rect.x + margin,
        y = Y = rect.y + margin,
        uiSize = sd ? 16 : 32,
        fontColor = G_COLOR_TONE[1],
        i, l;

        ctx.save();

        ctx.fillStyle = 'rgba(32,70,49,0.5)';
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
        ts.fillPattern(ctx, com.background, rect.x, rect.y, rect.width, rect.height);

        if (targetId > -1){
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.font = com.font;
            ctx.fillStyle = fontColor;

            switch(context){
                case G_CONTEXT.BAG:
                    var
                    stat = target[0],
                    count = target[1];

                    ts.draw(ctx, stat[OBJECT_ICON], x, y, tw, th);
                    ctx.fillText(stat[OBJECT_NAME], x + tw + margin, y + th/2);
                    y += uiSize;
                    ctx.fillText('count('+count+')', x, y + th/2);

                    break;
                case G_CONTEXT.WORLD:
                    switch(target[OBJECT_TYPE]){
                        case G_OBJECT_TYPE.CREEP:

                            var stat = ai.getStatByObject(target);

                            ctx.fillText(target[OBJECT_NAME]+' ('+G_CREEP_TYPE_NAME[target[OBJECT_SUB_TYPE]]+')', x, y + uiSize/2, rect.width);

                            x = X;
                            y += uiSize;
                            uiSize = sd ? 16 : 32;
         
                            x = me.drawData(ctx, ts, G_UI.PATK, target[CREEP_ATK], x, y, uiSize, margin, textWidth3);
                            x = me.drawData(ctx, ts, G_UI.RATK, target[CREEP_RATK], x, y, uiSize, margin, textWidth3);
                            x = me.drawData(ctx, ts, G_UI.MATK, target[CREEP_MATK], x, y, uiSize, margin, textWidth3);

                            x = X + pw;
                            uiSize = sd ? 8 : 16;
                            y = rect.y + uiSize;
                            
                            // draw hp
                            for(i=0, l=stat[CREEP_HP]; i<l; i++){
                                ts.draw(ctx, i<target[CREEP_HP] ? G_UI.HP : G_UI.HP_EMPTY, x, y, uiSize, uiSize);
                                x += uiSize;
                            }

                            x = X + pw;
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
                    break;
            }

            me.drawButtons(ctx, layouts, labels, fontColor, G_COLOR_TONE[3], G_COLOR_TONE[3]);
        }else{
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.font = com.font;
            ctx.fillStyle = fontColor;

            me.fillWrapText(ctx, target, x, y, pw*2, 20);
        }
        ctx.restore();
    };
});
