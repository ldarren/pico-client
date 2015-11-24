inherit('pico/picUIContent');

var trade = require('trade');
var hero = require('hero');
var ai = require('ai');

var
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
                if (hero.isEngaged(targetId)){
                    addOption('Flee', 'flee');
                }
                break;
            case G_OBJECT_TYPE.CHEST:
                switch(target[OBJECT_SUB_TYPE]){
                case G_CHEST_TYPE.CHEST:
                    if (target[CHEST_ITEM]){
                        this.go('openChest', targetId);
                        return;
                    }
                    break;
                case G_CHEST_TYPE.STASH:
                    var
                    npcId = target[STASH_OWNER],
                    npc = this.realNPCs[npcId];
                    if (!npc || !npc[NPC_GIFTS]) return;
                    this.go('showTrade', {
                        info:[npc[NPC_NAME]+": let's trade, these items are all for you, i'm looking forward to receive your items"],
                        content: npc[NPC_GIFTS],
                        labels: ['Accept', 'Sell', 'Close'],
                        callbacks:['accept', 'accept'],
                        events:[{npcId:npcId, isSell:false}, {npcId:npcId, isSell:true}],
                        market: trade.sellPrice, 
                        type: G_UI.GOLD
                    });
                    return;
                case G_CHEST_TYPE.CHEST_EMPTY:
                case G_CHEST_TYPE.STASH_EMPTY:
                default:
                    break;
                }
                break;
            case G_OBJECT_TYPE.NPC:
                switch(target[OBJECT_SUB_TYPE]){
                case G_NPC_TYPE.BLACKSMITH:
                    addOption('Buy', 'showGoods');
                    addOption('Upgrade', 'upgrade');
                    if (this.realNPCs[0]) addOption('Trade', 'gift');
                    break;
                case G_NPC_TYPE.ARCHMAGE:
                    addOption('Buy', 'showGoods');
                    addOption('Imbue', 'imbue');
                    if (this.realNPCs[1]) addOption('Trade', 'gift');
                    break;
                case G_NPC_TYPE.TOWN_GUARD:
                    addOption('Sell', 'showBag');
                    addOption('Gamble', 'gamble');
                    if (this.realNPCs[2]) addOption('Trade', 'gift');
                    break;
                }
                break;
            case G_OBJECT_TYPE.HEALTH:
                addOption('Consume', 'consume');
                break;
            case G_OBJECT_TYPE.ENV:
                switch(target[OBJECT_SUB_TYPE]){
                case G_ENV_TYPE.FOUNTAIN:
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
                break;
            case G_OBJECT_TYPE.MATERIAL:
                addOption('Acquire', 'acquire');
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
            if (hero.isItemEquipped(target)){
                addOption('Unequip', 'unequip');
            }else{
                addOption('Equip', 'equip');
                addOption('Recycle', 'recycle');
            }
            break;
        case G_OBJECT_TYPE.POTION:
            addOption('Drink', 'drink');
            addOption('Recycle', 'recycle');
            break;
        case G_OBJECT_TYPE.SCROLL:
            addOption('Chant', 'chant');
            addOption('Recycle', 'recycle');
            break;
        case G_OBJECT_TYPE.MATERIAL:
            addOption('Recycle', 'recycle');
            break;
        }
        break;
    case G_CONTEXT.TOME:
        if (hero.affordableSpell(target)) addOption('Cast', 'cast');
        addOption('Recycle', 'recycle');
        break;
    case G_CONTEXT.MERCHANT_BUY:
        addOption('Buy', 'buy');
        break;
    case G_CONTEXT.MERCHANT_SALE:
        addOption('Sell', 'sell');
        break;
    case G_CONTEXT.CREEP_TRAIT:
        addOption('Details', 'details');
        break;
    }
    addOption('Close');
},
equipInfo = function(id, stat, ctx, tss, rect, scale){
    switch(id){
    case 9: break;
    case 10:
        if (G_OBJECT_TYPE.WEAPON === stat[OBJECT_TYPE]){
            me.fillIconText(ctx, tss, stat[OBJECT_NAME] + ':' + stat[WEAPON_HANDED]+ 'H', rect, scale);
        }else{
            me.fillIconText(ctx, tss, stat[OBJECT_NAME], rect, scale);
        }
        break;
    case 11:
        break;
    case 12:
        me.fillIconText(ctx, tss, 'Level `0'+G_UI.LEVEL+' '+stat[OBJECT_LEVEL], rect, scale);
        break;
    default:
        var
        statTH = id - 20,
        currTH=-1,
        val;

        for(var i=OBJECT_HP,l=OBJECT_EARTH+1; i<l; i++){
            val = stat[i];
            if (val) currTH++;
            if (currTH !== statTH) continue;
            if (OBJECT_VEG <= i && OBJECT_DEMON >= i){
                me.fillIconText(ctx, tss, G_STAT_NAME[i]+' `0'+G_STAT_ICON[i]+' X'+val, rect, scale);
            } else {
                me.fillIconText(ctx, tss, G_STAT_NAME[i]+' `0'+G_STAT_ICON[i]+(val > 0 ? ' +':' ')+val, rect, scale);
            }
            break;
        }
        break;
    }
},
onCustomBound = function(ent, rect, ui, scale){
    return me.calcUIRect(rect, ui);
},
onCustomDraw = function(ent, ctx, rect, ui, tss, scale){
    if (!me.isValid() || !target) return;

    var 
    com = ent.getComponent(name),
    ts = tss[0],
    tw = this.tileWidth,
    th = this.tileHeight, 
    x=rect[0], y=rect[1], w=rect[2], h=rect[3],
    id = ui.userData.id,
    icon;

    if (id < 9){
        if (labels[id]) me.drawButton(ctx, ts, labels[id], rect, scale, G_COLOR_TONE[0], G_COLOR_TONE[3]);
    }else{
        switch(context){
        case G_CONTEXT.TOME:
            switch(id){
            case 10:
                me.fillIconText(ctx, tss, target[OBJECT_NAME]+': '+target[OBJECT_DESC], rect, scale);
                break;
            case 20:
                me.fillIconText(ctx, tss, 'Level `0'+G_UI.LEVEL+' '+target[OBJECT_LEVEL], rect, scale);
                break;
            case 21:
                me.fillIconText(ctx, tss, 'Cost `0'+G_STAT_ICON[target[SPELL_ATTR]]+' '+target[SPELL_COST], rect, scale);
                break;
            case 22:
                me.fillIconText(ctx, tss, 'Wait `0'+G_UI.COOLDOWN+' '+target[SPELL_RELOAD], rect, scale);
                break;
            case 23:
                me.fillIconText(ctx, tss, 'Dmg `0'+G_UI.DAMAGE+' '+target[SPELL_DAMAGE], rect, scale);
                break;
            case 30:
                if(target[OBJECT_LEVEL] < 3){
                    me.fillIconText(ctx, tss, 'Level up:', rect, scale);
                }else{
                    me.fillIconText(ctx, tss, 'Level maxed', rect, scale);
                }
                break;
            case 31:
                if(target[OBJECT_LEVEL] < 3){
                    icon = '';
                    if (target[SPELL_FIRE]) icon += '`0'+G_UI.FIRE+' '+hero.getStat(OBJECT_FIRE)+'/'+target[SPELL_FIRE];
                    if (target[SPELL_AIR]) icon += ' `0'+G_UI.AIR+' '+hero.getStat(OBJECT_AIR)+'/'+target[SPELL_AIR];
                    if (target[SPELL_WATER]) icon += ' `0'+G_UI.WATER+' '+hero.getStat(OBJECT_WATER)+'/'+target[SPELL_WATER];
                    if (target[SPELL_EARTH]) icon += ' `0'+G_UI.EARTH+' '+hero.getStat(OBJECT_EARTH)+'/'+target[SPELL_EARTH];
                    me.fillIconText(ctx, tss, icon, rect, scale);
                }
            }
            break;
        case G_CONTEXT.BAG:
            var stat = target[0];

            switch(stat[OBJECT_TYPE]){
            case G_OBJECT_TYPE.WEAPON:
            case G_OBJECT_TYPE.AMMO:
            case G_OBJECT_TYPE.ARMOR:
            case G_OBJECT_TYPE.JEWEL:
                equipInfo.call(this, id, stat, ctx, tss, rect, scale);
                break;
            case G_OBJECT_TYPE.POTION:
            case G_OBJECT_TYPE.SCROLL:
            case G_OBJECT_TYPE.MATERIAL:
            default:
                if (9 === id) me.fillIconText(ctx, tss, stat[OBJECT_NAME]+': '+stat[OBJECT_DESC], rect, scale);
                break;
            }
            break;
        case G_CONTEXT.WORLD:
            switch(target[OBJECT_TYPE]){
            case G_OBJECT_TYPE.CREEP:
                switch(id){
                case 10:
                    me.fillIconText(ctx, tss, target[OBJECT_NAME]+' `0'+G_STAT_ICON[OBJECT_VEG+target[OBJECT_SUB_TYPE]-1], rect, scale);
                    break;
                case 11:
                    me.fillIconText(ctx, tss, 'Level `0'+G_UI.LEVEL+' '+target[OBJECT_LEVEL], rect, scale);
                    break;
                case 12:
                    me.fillIconText(ctx, tss, 'HP `0'+G_UI.HP+' '+target[CREEP_HP]+'/'+ai.getStatByObject(target)[CREEP_HP], rect, scale);
                    break;
                case 20:
                    me.fillIconText(ctx, tss, 'Atk `0'+G_UI.PATK+' '+target[CREEP_ATK], rect, scale);
                    break;
                case 21:
                    me.fillIconText(ctx, tss, 'Def `0'+G_UI.PDEF+' '+target[CREEP_PDEF], rect, scale);
                    break;
                case 22:
                    me.fillIconText(ctx, tss, 'Will `0'+G_UI.WILL+' '+target[CREEP_MDEF], rect, scale);
                    break;
                case 30:
                    var
                    buf=target[CREEP_TRAITS],
                    l=buf.length;
                    icon = l ? 'Buf:' : 'No buf';
                    for(var i=0; i<l; i++){
                        icon += ' `1'+buf[i][OBJECT_ICON];
                    }
                    me.fillIconText(ctx, tss, icon, rect, scale);
                    break;
                }
                break;
            case G_OBJECT_TYPE.AMMO:
                equipInfo.call(this, id, target, target[AMMO_SIZE], ctx, tss, rect, scale);
                break;
            case G_OBJECT_TYPE.WEAPON:
            case G_OBJECT_TYPE.ARMOR:
            case G_OBJECT_TYPE.JEWEL:
                equipInfo.call(this, id, target, 1, ctx, tss, rect, scale);
                break;
            case G_OBJECT_TYPE.ENV:
                var icon = target[OBJECT_DESC].toString();
                if (icon.length > 128) icon = icon.substr(0, 128)+' ...';
                if (9 === id)me.fillIconText(ctx, tss, target[OBJECT_NAME]+': '+icon, rect, scale);
                break;
            case G_OBJECT_TYPE.POTION:
            case G_OBJECT_TYPE.SCROLL:
            case G_OBJECT_TYPE.MATERIAL:
            case G_OBJECT_TYPE.CHEST:
            case G_OBJECT_TYPE.KEY:
            default:
                if (9 === id){
                    if (targetId > -1)
                        me.fillIconText(ctx, tss, target[OBJECT_NAME]+': '+target[OBJECT_DESC], rect, scale);
                    else
                        me.fillIconText(ctx, tss, target, rect, scale);
                }
                break;
            }
            break;
        }
    }
},
onCustomButton = function(ent, ctx, rect, ui, tss, scale){
    var ts = tss[0];
    me.drawButton(ctx, ts, labels[ui.userData.id], rect, scale, G_COLOR_TONE[3], G_COLOR_TONE[0], G_COLOR_TONE[1], 3);
},
onCustomClick = function(ent, ui){
    this.go('hideInfo');
    if (!ui){
        if (!labels.length && callbacks.length){
            this.go(callbacks[0], events[0]);
        }
        return false;
    }

    var
    com = ent.getComponent(name),
    i = ui.userData.id,
    callback = callbacks[i],
    eventObj = events[i];

    if (undefined === eventObj){
        switch(callback){
        case 'equip':
            hero.equipItem.call(this, target);
            break;
        case 'unequip':
            hero.unequipItem.call(this, target);
            break;
        case 'fight':
            this.audioSprite.play(2);
            this.go('attack', hero.attack(targetId));
            break;
        case 'flee':
            this.go('flee');
            break;
        case 'speak':
            break;
        case 'consume':
            delete this.objects[targetId];
            hero.incrHp(1);
            ai.incrHpAll(1);
            break;
        case 'read':
            this.go('showDialog', {info: [target[OBJECT_DESC]]});
            break;
        case 'rejuvenate':
            hero.incrHp();
            hero.incrPAtk();
            hero.incrRAtk();
            hero.incrDef();
            hero.incrWill();
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
        case 'acquire':
            this.go('showDialog', {
                info: [
                    'Congratulations!',
                    'Well done brave soul, you have completed the testament i given to you, now ascending to Valhalla, come to my side and aid me in the Ragnorak!'
                ],
                callbacks:['resetWorld'],
                labels:['Reborn']
            });
            break;
        case 'gamble':
            if (hero.isBagFull()){
                this.go('showDialog', {info:G_MSG.BAG_FULL});
                return;
            }

            var 
            shop = G_SHOP[2].slice(),
            content = [];
            for(var i=0; i<12; i++){
                content.push(shop.splice(Floor(Random()*shop.length), 1)[0]);
            }
            this.go('showTrade', {
                info:['You might get some good stuffs here'],
                content: content,
                labels: ['Bet', 'Close'],
                callbacks:['bet'],
                market: trade.gamblePrice, 
                type: G_UI.GOLD
            });
            break;
        case 'imbue':
            var
            bag = hero.getBag(),
            content = [],
            item, slot;
            for(var i=0,l=bag.length; i<l; i++){
                slot = bag[i];
                if (!slot) continue;
                item = slot[0];
                switch(item[OBJECT_TYPE]){
                case G_OBJECT_TYPE.WEAPON:
                case G_OBJECT_TYPE.ARMOR:
                case G_OBJECT_TYPE.AMMO:
                case G_OBJECT_TYPE.JEWEL:
                    content.push(slot);
                }
            }
            this.go('showTrade', {
                info:['Select an item to replace it magic attributes'],
                content: content,
                labels: ['Imbue', 'Close'],
                callbacks:['imbue'],
                market: trade.imbuePrice, 
                type: G_UI.GOLD
            });
            break;
        case 'upgrade':
            var
            capLvl = G_MAP_PARAMS.length - 1,
            bag = hero.getBag(),
            content = [],
            item, slot;
            for(var i=0,l=bag.length; i<l; i++){
                slot = bag[i];
                if (!slot) continue;
                item = slot[0];
                if (G_GRADE.COMMON !== item[OBJECT_GRADE] || capLvl === item[OBJECT_LEVEL]) continue;
                switch(item[OBJECT_TYPE]){
                case G_OBJECT_TYPE.WEAPON:
                case G_OBJECT_TYPE.ARMOR:
                case G_OBJECT_TYPE.AMMO:
                    content.push(slot);
                }
            }
            this.go('showTrade', {
                info:['Select a non-magical item to upgrade it\'s level'],
                content: content,
                labels: ['Upgrade', 'Close'],
                callbacks:['upgrade'],
                market: trade.upgradePrice, 
                type: G_UI.GOLD
            });
            break;
        case 'gift':
            var npc = this.realNPCs[target[OBJECT_ICON]];
            if (!npc) return;
            this.go('showTrade', {
                info:['Choose an item to trade with '+npc[NPC_NAME], npc[NPC_NAME]+' might return something useful to you'],
                content: hero.getBag(),
                labels: ['Trade', 'Close'],
                callbacks:['gifting'],
                events: [{npc: npc}],
                market: trade.sellPrice, 
                type: G_UI.GOLD
            });
            break;
        case 'showGoods':
            if (hero.isBagFull()){
                this.go('showDialog', {info:G_MSG.BAG_FULL});
                return;
            }

            var content;
            switch(target[OBJECT_SUB_TYPE]){
            case G_NPC_TYPE.BLACKSMITH: content = G_SHOP[0]; break;
            case G_NPC_TYPE.ARCHMAGE: content = G_SHOP[1]; break;
            }
            this.go('showTrade', {
                info:['Buy an item for your anventure'],
                content: content,
                labels: ['Buy', 'Close'],
                callbacks:['buy'],
                market: trade.buyPrice, 
                type: G_UI.GOLD
            });
            break;
        case 'showBag':
            this.go('showTrade', {
                info:['Select an item to trade with merchant'],
                content: hero.getBag() || [],
                labels: ['Sell', 'Close'],
                callbacks:['sell'],
                market: trade.sellPrice, 
                type: G_UI.GOLD
            });
            break;
        case 'recycle':
            var name, info, callback;
            switch(context){
            case G_CONTEXT.BAG:
                var stat = target[0];
                name = stat[OBJECT_NAME];
                info = 'This will remove '+name+' permanently from your bag, and add 1 ';
                callback = 'recycleItem';
                switch(stat[OBJECT_TYPE]){
                case G_OBJECT_TYPE.WEAPON:
                    info += 'ATK `0'+G_UI.PATK;
                    break;
                case G_OBJECT_TYPE.AMMO:
                    info += 'ATK `0'+G_UI.RATK;
                    break;
                case G_OBJECT_TYPE.ARMOR:
                    info += 'DEF `0'+G_UI.PDEF;
                    break;
                case G_OBJECT_TYPE.JEWEL:
                case G_OBJECT_TYPE.POTION:
                case G_OBJECT_TYPE.SCROLL:
                case G_OBJECT_TYPE.MATERIAL:
                    info += 'Will `0'+G_UI.WILL;
                    break;
                }
                break;
            case G_CONTEXT.TOME:
                name = target[OBJECT_NAME];
                info = 'This will remove the selected spell permanently from tome, and add 1 HP `0'+G_UI.HP;
                callback = 'forgetSpell';
                break;
            }
            this.go('showDialog',{
                info:['Recycling '+name, info],
                labels:['Recycle', 'Close'],
                callbacks:[callback],
                events:[targetId]});
            break;
        case 'chant':
            this.go('chant', [targetId]);
            break;
        case 'cast':
            this.go('castSpell', target);
            break;
        }
    }else if (callback) {
        this.go(callback, eventObj);
    }

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
me.show = function(ent, com, evt){
    if (!evt) return;

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
            target = hero.getBag()[targetId];
            break;
        case G_CONTEXT.TOME:
            target = hero.getTome()[targetId];
            break;
        case G_CONTEXT.WORLD:
            target = this.objects[targetId];
            break;
        }
    }

    if (evt.callbacks) callbacks = evt.callbacks;
    if (evt.events) events = evt.events;
    if (evt.labels) labels = evt.labels;
    else addButtons.call(this);
};

me.hide = function(ent, com, evt){
    if (undefined === evt) return;
    labels.length = 0;
    callbacks.length = 0;
    events.length = 0;
    targetId = target = undefined;
};

me.isValid = function(){
    return undefined !== targetId;
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

    switch(context){
    case G_CONTEXT.WORLD:
        row=me.createMeshRow(rows);
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.TOP_LEFT, me.TOP_LEFT, 0, 3, 3, 0, 0, {id:9});
        me.createMeshCustom(cell, me.TOP_LEFT, me.TOP_LEFT, 0, 1, 1, 0, 0, {id:10});
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.TOP_LEFT, me.TOP_LEFT, 0, 1, 1, 0, 0, {id:11});
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.TOP_LEFT, me.TOP_LEFT, 0, 1, 1, 0, 0, {id:12});

        row=me.createMeshRow(rows);
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.TOP_LEFT, me.TOP_LEFT, 0, 1, 1, 0, 0, {id:20});
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.TOP_LEFT, me.TOP_LEFT, 0, 1, 1, 0, 0, {id:21});
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.TOP_LEFT, me.TOP_LEFT, 0, 1, 1, 0, 0, {id:22});

        row=me.createMeshRow(rows);
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.TOP_LEFT, me.TOP_LEFT, 0, 1, 1, 0, 0, {id:23});
        me.createMeshCustom(cell, me.TOP, me.TOP, -3, 3, 1, 0, 0, {id:30});
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.TOP_LEFT, me.TOP_LEFT, 0, 1, 1, 0, 0, {id:24});
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.TOP_LEFT, me.TOP_LEFT, 0, 1, 1, 0, 0, {id:25});
        break;
    case G_CONTEXT.BAG:
        row=me.createMeshRow(rows);
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.TOP_LEFT, me.TOP_LEFT, 0, 2, 1, 0, 0, {id:10});
        me.createMeshCustom(cell, me.TOP_LEFT, me.TOP_LEFT, 0, 3, 3, 0, 0, {id:9});
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.TOP_LEFT, me.TOP_LEFT, 0, 1, 1, 0, 0, {id:11});
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.TOP_LEFT, me.TOP_LEFT, 0, 1, 1, 0, 0, {id:12});

        row=me.createMeshRow(rows);
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.TOP_LEFT, me.TOP_LEFT, 0, 1, 1, 0, 0, {id:20});
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.TOP_LEFT, me.TOP_LEFT, 0, 1, 1, 0, 0, {id:21});
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.TOP_LEFT, me.TOP_LEFT, 0, 1, 1, 0, 0, {id:22});

        row=me.createMeshRow(rows);
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.TOP_LEFT, me.TOP_LEFT, 0, 1, 1, 0, 0, {id:23});
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.TOP_LEFT, me.TOP_LEFT, 0, 1, 1, 0, 0, {id:24});
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.TOP_LEFT, me.TOP_LEFT, 0, 1, 1, 0, 0, {id:25});
        break;
    case G_CONTEXT.TOME:
        row=me.createMeshRow(rows);
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.TOP_LEFT, me.TOP_LEFT, 0, 1, 1, 0, 0, {id:10});

        row=me.createMeshRow(rows);
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.TOP_LEFT, me.TOP_LEFT, 0, 1, 1, 0, 0, {id:20});
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.TOP_LEFT, me.TOP_LEFT, 0, 1, 1, 0, 0, {id:21});
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.TOP_LEFT, me.TOP_LEFT, 0, 1, 1, 0, 0, {id:22});
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.TOP_LEFT, me.TOP_LEFT, 0, 1, 1, 0, 0, {id:23});

        row=me.createMeshRow(rows);
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.TOP_LEFT, me.TOP_LEFT, 0, 1, 1, 0, 0, {id:30});
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.TOP_LEFT, me.TOP_LEFT, 0, 3, 1, 0, 0, {id:31});
        me.createMeshCell(row);
        me.createMeshCell(row);
        break;
    }

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

    return me.drawMeshUI.call(this, ctx, [this.tileSet, this.spellSet], ent, com, comBox, scale, onCustomUI);
};
