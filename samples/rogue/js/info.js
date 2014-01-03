pico.def('info', 'picUIContent', function(){

    var
    me = this,
    Floor = Math.floor, Ceil = Math.ceil, Round = Math.round, Random = Math.random,
    name = me.moduleName,
    layouts = [],
    labels = [],
    callbacks = [],
    events = [],
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
                        addOption('Buy Items', 'showMerchantGoods');
                        addOption('Craft', 'craft');
                        break;
                    case G_NPC_TYPE.ARCHMAGE:
                        addOption('Buy Items', 'showMerchantGoods');
                        addOption('Identify', 'identify');
                        break;
                    case G_NPC_TYPE.TOWN_GUARD:
                        addOption('Sale Items', 'showMyGoods');
                        addOption('Gamble', 'gamble');
                        break;
                    }
                    break;
                case G_OBJECT_TYPE.HEALTH:
                    addOption('Consume', 'consume');
                    break;
                case G_OBJECT_TYPE.ENV:
                    switch(target[OBJECT_SUB_TYPE]){
                    case G_ENV_TYPE.SHRINE:
                        addOption('Rejuvenate', 'rejuvenate');
                        break;
                    case G_ENV_TYPE.ALTAR:
                        addOption('Make Offering', 'offering');
                        break;
                    case G_ENV_TYPE.TOMB:
                        addOption('Recover', 'recover');
                        break;
                    case G_ENV_TYPE.BANNER:
                        addOption('Be Blessed', 'blessed');
                        break;
                    case G_ENV_TYPE.MESSAGE_BOARD:
                        addOption('Read', 'read');
                        break;
                    }
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
                addOption('Chant', 'chant');
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
    onCustomBound = function(ent, rect, ui, scale){
        return me.calcUIRect(rect, ui);
    },
    onCustomDraw = function(ent, ctx, rect, ui, ts, scale){
        if (!me.isValid()) return;
        var
        com = ent.getComponent(name),
        tw = this.tileWidth,
        th = this.tileHeight,
        x=rect[0], y=rect[1], w=rect[2], h=rect[3];

        switch(ui.userData.id){
        case 'icon':
            x = x + (w - tw)/2;
            y = y + (h - th)/2;
            if (targetId > -1){
                switch(context){
                case G_CONTEXT.TOME:
                    ts.draw(ctx, target[OBJECT_ICON], x, y, tw, th);
                    break;
                case G_CONTEXT.BAG:
                    ts.draw(ctx, target[0][OBJECT_ICON], x, y, tw, th);
                    break;
                case G_CONTEXT.WORLD:
                    // can use target[OBJECT_TYPE] === G_OBJECT_TYPE.CREEP to get object type
                    ts.draw(ctx, target[OBJECT_ICON], x, y, tw, th);
                    break;
                }
            }
            break;
        case 'text':
            if (targetId > -1){
                switch(context){
                case G_CONTEXT.TOME:
                    me.fillIconText(ctx, ts, target[OBJECT_NAME], rect, scale);
                    break;
                case G_CONTEXT.BAG:
                    var
                    stat = target[0],
                    count = target[1];
            
                    me.fillIconText(ctx, ts, stat[OBJECT_NAME]+'count('+count+')', rect, scale);
                    break;
                case G_CONTEXT.WORLD:
                    switch(target[OBJECT_TYPE]){
                    case G_OBJECT_TYPE.CREEP:
                        break;
                    default:
                        me.fillIconText(ctx, ts, target[OBJECT_NAME], rect, scale);
                        break;
                    }
                    break;
                }
            }else{
                me.fillIconText(ctx, ts, target, rect, scale);
            }
            break;
        case 'name':
            if (G_CONTEXT.WORLD === context && G_OBJECT_TYPE.CREEP === target[OBJECT_TYPE]){
                me.fillIconText(ctx, ts, target[OBJECT_NAME]+' ('+G_CREEP_TYPE_NAME[target[OBJECT_SUB_TYPE]]+')', rect, scale);
            }
            break;
        case 'level':
            if (G_CONTEXT.WORLD === context && G_OBJECT_TYPE.CREEP === target[OBJECT_TYPE]){
                me.fillIconText(ctx, ts, '`'+G_UI.LEVEL+': '+target[OBJECT_LEVEL], rect, scale);
            }
            break;
        case 'hp':
            if (G_CONTEXT.WORLD === context && G_OBJECT_TYPE.CREEP === target[OBJECT_TYPE]){
                var
                stat = this.ai.getStatByObject(target),
                iconText = '';
                for(var i=0, l=stat[CREEP_HP]; i<l; i++){
                    iconText += ' `'+((i < target[CREEP_HP]) ? G_UI.HP : G_UI.HP_EMPTY);
                }
                me.fillIconText(ctx, ts, iconText, rect, scale);
            }
            break;
        case 'def':
            if (G_CONTEXT.WORLD === context && G_OBJECT_TYPE.CREEP === target[OBJECT_TYPE]){
                me.fillIconText(ctx, ts, '`'+G_UI.PDEF+': '+target[CREEP_DEF], rect, scale);
            }
            break;
        case 'patk':
            if (G_CONTEXT.WORLD === context && G_OBJECT_TYPE.CREEP === target[OBJECT_TYPE]){
                me.fillIconText(ctx, ts, '`'+G_UI.PATK+': '+target[CREEP_ATK], rect, scale);
            }
            break;
        case 'ratk':
            if (G_CONTEXT.WORLD === context && G_OBJECT_TYPE.CREEP === target[OBJECT_TYPE]){
                me.fillIconText(ctx, ts, '`'+G_UI.RATK+': '+target[CREEP_RATK], rect, scale);
            }
            break;
        case 'matk':
            if (G_CONTEXT.WORLD === context && G_OBJECT_TYPE.CREEP === target[OBJECT_TYPE]){
                me.fillIconText(ctx, ts, '`'+G_UI.MATK+': '+target[CREEP_MATK], rect, scale);
            }
            break;
        default:
            me.drawButton(ctx, rect, labels[ui.userData.id], '#d7e894', '#204631');
            break;
        }

    },
    onCustomButton = function(ent, ctx, rect, ui, ts, scale){
        me.drawButton(ctx, rect, labels[ui.userData.id], '#204631', '#d7e894', '#aec440', 'top');
    },
    onCustomClick = function(ent, ui){
        if (!ui){
            this.go('hideInfo');
            return false;
        }

        var
        com = ent.getComponent(name),
        i = ui.userData.id,
        callback = callbacks[i],
        eventObj = events[i];

        if (undefined !== eventObj){
            if (callback) this.go(callback, eventObj);
        }else{
            var
            hero = this.hero,
            ai = this.ai;

            switch(callback){
            case 'fight':
                this.audioSprite.play(2);
                this.go('startEffect', 'halfMoon');
                //this.go('attack', hero.battle(targetId, false));
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
            case 'rejuvenate':
                hero.rejuvenate();
                this.go('forceRefresh');
                break;
            case 'recover':
                this.go('recover', [targetId]);
                break;
            case 'move':
                this.go('heroMoveTo', [this.nextTile(targetId, hero.getPosition())]);
                break;
            case 'unlock':
                this.go('openGate', [targetId]);
                break;
            case 'showMerchantGoods':
                this.go('showTrade', [targetId]);
                break;
            case 'showMyGoods':
                this.go('openForSale', [G_WIN_ID.BAG, 'sale']);
                break;
            case 'chant':
                this.go('chant', [targetId]);
                break;
            }
        }
        this.go('hideInfo');

        return true;
    },
    onCustomUI = function(){
        switch(Array.prototype.shift.call(arguments)){
        case me.CUSTOM_BOUND: return onCustomBound.apply(this, arguments); break;
        case me.CUSTOM_DRAW: return onCustomDraw.apply(this, arguments); break;
        case me.CUSTOM_CLICK: return onCustomClick.apply(this, arguments); break;
        case me.CUSTOM_BUTTON: return onCustomButton.apply(this, arguments); break;
        }
        return false;
    };

    me.create = function(ent, data){
        data = me.base.create.call(this, ent, data);

        data.font = this.smallDevice ? data.fontSmall : data.fontBig;
        return data;
    };

    /*
     * evt.context: context of targetId
     * evt.targetId: selected item id, can ve item, spell or world objects, depends on context
     * evt.info: text info, if set, evt.targetId will be reset to -1
     * evt.labels: button labels, if evt.callbacks not set info dialog will be closed
     * evt.callbacks: callbacks when button clicked e.g. me.go(evt.callbacks[0], evt.events[0])
     * evt.events: parameters of callback, if not defined, auto parameter will be created
     */
    me.open = function(ent, evt){
        labels.length = 0;
        callbacks.length = 0;
        events.length = 0;

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
        if (evt.events) events = evt.events;
        if (evt.labels) labels = evt.labels;
        else addButtons.call(this);
    };

    me.close = function(){
        labels.length = 0;
        callbacks.length = 0;
        events.length = 0;
        targetId = target = undefined;
    };

    me.isValid = function(){
        return undefined !== targetId;
    };

    me.doubleClick = function(elapsed, evt, entities){
        console.log('DOUBLE CLICKED!');
    };

    me.resize = function(ent, width, height){
        var
        com = ent.getComponent(name),
        style = {font:com.font, fillStyle:com.fontColor},
        meshui = me.createMeshUI(null, me.TOP_LEFT, me.TOP_LEFT, 0, width, height, style),
        rows = meshui.rows,
        row,cell;

        if (labels.length){
            row=me.createMeshRow(rows);
            for(var i=0,l=labels.length; i<l; i++){
                cell=me.createMeshCell(row);
                me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, 1, 1, 1, 0, {id:i});
            }
        }

        row=me.createMeshRow(rows);
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.TOP_LEFT, me.TOP_LEFT, 0, 1, 3, 0, 0, {id:'icon'});
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.TOP_LEFT, me.TOP_LEFT, 0, 2, 1, 0, 0, {id:'name'});
        me.createMeshCustom(cell, me.TOP_LEFT, me.TOP_LEFT, 0, 3, 3, 0, 0, {id:'text'});
        cell=me.createMeshCell(row);
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, 1, 1, 0, 0, {id:'level'});

        row=me.createMeshRow(rows);
        cell=me.createMeshCell(row);
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.TOP_LEFT, me.TOP_LEFT, 0, 2, 1, 0, 0, {id:'hp'});
        cell=me.createMeshCell(row);
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, 1, 1, 0, 0, {id:'def'});

        row=me.createMeshRow(rows);
        cell=me.createMeshCell(row);
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, 1, 1, 0, 0, {id:'patk'});
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, 1, 1, 0, 0, {id:'ratk'});
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, 1, 1, 0, 0, {id:'matk'});

        com.layout = meshui;

        return [width, height];
    };

    me.click = function(ent, x, y, state){
        var
        com = ent.getComponent(name),
        comBox = ent.getComponent(com.box),
        scale = this.smallDevice ? 1 : 2;

        return me.clickMeshUI.call(this, x, y, state, ent, com, comBox, scale, onCustomUI);
    };

    me.draw = function(ctx, ent, clip){
        var
        com = ent.getComponent(name),
        comBox = ent.getComponent(com.box),
        scale = this.smallDevice ? 1 : 2;

        return me.drawMeshUI.call(this, ctx, {default: this.tileSet}, ent, com, comBox, scale, onCustomUI);
    };
});
