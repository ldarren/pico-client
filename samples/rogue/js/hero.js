pico.def('hero', 'picUIContent', function(){
    var
    me = this,
    name = me.moduleName,
    Floor = Math.floor, Ceil = Math.ceil, Round = Math.round, Random = Math.random, Max = Math.max,
    objects, flags, ai,
    position, selectedSpell,
    heroObj, currStats,
    appearance, stats, effects, bag, tome,
    onCustomBound = function(ent, rect, ui, tileScale){
        var id = ui.userData.id;

        switch(id){
        case 'avatar':
        case 'helm':
        case 'armor':
        case 'main':
        case 'off':
        case 'ringL':
        case 'ringR':
        case 'amulet':
        case 'quiver':
        case 'status':
            return me.calcUIRect(rect, ui, tileScale);
        default:
            if (effects[id]){
                return me.calcUIRect(rect, ui, tileScale);
            }
            return me.calcUIRect(rect, ui);
        }
    },
    onCustomDraw = function(ent, ctx, rect, ui, tss, tileScale){
        var
        com = ent.getComponent(name),
        id = ui.userData.id,
        ts = tss[0],
        ss = tss[1];

        switch(id){
        case 'avatar':
            ts.draw(ctx, currStats[OBJECT_ICON], rect[0], rect[1], rect[2], rect[3]);
            break;
        case 'name':
            me.fillIconText(ctx, tss, currStats[OBJECT_NAME], rect, tileScale);
            break;
        case 'desc':
            if (com.activated){
                var selectedObj = effects[com.activated];
                if (!selectedObj) {
                    selectedObj = appearance[me.convertEquipId(com.activated)];
                    if (selectedObj) selectedObj = selectedObj[0];
                }
                if (selectedObj) me.fillIconText(ctx, tss, selectedObj[OBJECT_DESC], rect, tileScale);
            }
            break;
        case 'level':
            me.fillIconText(ctx, tss, ''+currStats[OBJECT_LEVEL], rect, tileScale);
            break;
        case 'str':
            me.fillIconText(ctx, tss, ''+currStats[OBJECT_STR], rect, tileScale);
            break;
        case 'dex':
            me.fillIconText(ctx, tss, ''+currStats[OBJECT_DEX], rect, tileScale);
            break;
        case 'luck':
            me.fillIconText(ctx, tss, ''+currStats[OBJECT_LUCK], rect, tileScale);
            break;
        case 'will':
            me.fillIconText(ctx, tss, ''+appearance[HERO_WILL]+'/'+currStats[OBJECT_WILL], rect, tileScale);
            break;
        case 'hp':
            me.fillIconText(ctx, tss, ''+appearance[HERO_HP]+'/'+currStats[OBJECT_HP], rect, tileScale);
            break;
        case 'gold':
            me.fillIconText(ctx, tss, ''+appearance[HERO_GOLD], rect, tileScale);
            break;
        case 'piety':
            me.fillIconText(ctx, tss, ''+this.god.getPiety(), rect, tileScale);
            break;
        case 'patk':
            me.fillIconText(ctx, tss, ''+appearance[HERO_PATK]+'/'+currStats[OBJECT_PATK], rect, tileScale);
            break;
        case 'ratk':
            me.fillIconText(ctx, tss, ''+appearance[HERO_RATK]+'/'+currStats[OBJECT_RATK], rect, tileScale);
            break;
        case 'def':
            me.fillIconText(ctx, tss, ''+appearance[HERO_DEF]+'/'+currStats[OBJECT_DEF], rect, tileScale);
            break;
        case 'veg':
            me.fillIconText(ctx, tss, 'X'+Floor(currStats[OBJECT_VEG]*100)+'%', rect, tileScale);
            break;
        case 'insect':
            me.fillIconText(ctx, tss, 'X'+Floor(currStats[OBJECT_INSECT]*100)+'%', rect, tileScale);
            break;
        case 'beast':
            me.fillIconText(ctx, tss, 'X'+Floor(currStats[OBJECT_BEAST]*100)+'%', rect, tileScale);
            break;
        case 'undead':
            me.fillIconText(ctx, tss, 'X'+Floor(currStats[OBJECT_UNDEAD]*100)+'%', rect, tileScale);
            break;
        case 'demon':
            me.fillIconText(ctx, tss, 'X'+Floor(currStats[OBJECT_DEMON]*100)+'%', rect, tileScale);
            break;
        case 'fire':
            me.fillIconText(ctx, tss, ''+currStats[OBJECT_FIRE], rect, tileScale);
            break;
        case 'air':
            me.fillIconText(ctx, tss, ''+currStats[OBJECT_AIR], rect, tileScale);
            break;
        case 'water':
            me.fillIconText(ctx, tss, ''+currStats[OBJECT_WATER], rect, tileScale);
            break;
        case 'earth':
            me.fillIconText(ctx, tss, ''+currStats[OBJECT_EARTH], rect, tileScale);
            break;
        case 'helm':
        case 'armor':
        case 'main':
        case 'off':
        case 'ringL':
        case 'ringR':
        case 'amulet':
        case 'quiver':
            var item = appearance[me.convertEquipId(id)];
            if (item) ts.draw(ctx, item[0][OBJECT_ICON], rect[0], rect[1], rect[2], rect[3]);
            break;
        default:
            var effect = effects[id];
            if (effect){
                var
                x=rect[0],y=rect[1],w=rect[2],h=rect[3],
                crop = tileScale * 4,
                cropLength = tileScale * 24;

                // crop spell image to show slot frame
                ss.draw(ctx, effect[OBJECT_ICON], x+crop, y+crop, cropLength, cropLength, 4, 4, 24, 24);
            }
            break;
        }
        if (id === com.activated) {
            ts.draw(ctx, G_UI.SELECTED, rect[0], rect[1], rect[2], rect[3]);
        }
    },
    onCustomClick = function(ent, ui){
        var com = ent.getComponent(name);

        com.activated = '';

        if (!ui){
            return false;
        }
        var
        id = ui.userData.id,
        selectedObj = effects[id];

        if (!selectedObj){
            selectedObj = appearance[me.convertEquipId(id)];
        }

        if (selectedObj){
            com.activated = id;
            return true;
        }
        return false;
    },
    onCustomUI = function(){
        if (!this.mortal) return;
        switch(Array.prototype.shift.call(arguments)){
        case me.CUSTOM_BOUND: return onCustomBound.apply(this, arguments); break;
        case me.CUSTOM_DRAW: return onCustomDraw.apply(this, arguments); break;
        case me.CUSTOM_CLICK: return onCustomClick.apply(this, arguments); break;
        case me.CUSTOM_BUTTON: return onCustomDraw.apply(this, arguments); break;
        }
    },
    restoreStat = function(maxIdx, currIdx, val){
        var
        max = currStats[maxIdx],
        curr = appearance[currIdx];

        if (undefined === val) val = max;

        curr += val;
        if (curr > max) curr = max;
        else if (curr < 0) curr = 0;

        appearance[currIdx] = curr;
        return curr;
    },
    createEffect = function(type, level, period, icon){
        var orgStats = stats;
        switch(type){
        case G_EFFECT_TYPE.SQUEAL:
            suppressEffects([G_EFFECT_TYPE.SQUEAL, G_EFFECT_TYPE.NOCTURNAL, G_EFFECT_TYPE.LYCAN, G_EFFECT_TYPE.GROWL]);
            stats = G_CREATE_OBJECT(G_ICON.ASH_RAT, orgStats[OBJECT_NAME]);
            stats[OBJECT_SUB_TYPE] = orgStats[OBJECT_SUB_TYPE];
            break;
        case G_EFFECT_TYPE.NOCTURNAL:
            suppressEffects([G_EFFECT_TYPE.SQUEAL, G_EFFECT_TYPE.NOCTURNAL, G_EFFECT_TYPE.LYCAN, G_EFFECT_TYPE.GROWL]);
            stats = G_CREATE_OBJECT(G_ICON.TAINTED_BAT, orgStats[OBJECT_NAME]);
            stats[OBJECT_SUB_TYPE] = orgStats[OBJECT_SUB_TYPE];
            break;
        case G_EFFECT_TYPE.LYCAN:
            suppressEffects([G_EFFECT_TYPE.SQUEAL, G_EFFECT_TYPE.NOCTURNAL, G_EFFECT_TYPE.LYCAN, G_EFFECT_TYPE.GROWL]);
            stats = G_CREATE_OBJECT(G_ICON.DIRE_WOLF, orgStats[OBJECT_NAME]);
            stats[OBJECT_SUB_TYPE] = orgStats[OBJECT_SUB_TYPE];
            break;
        case G_EFFECT_TYPE.GROWL:
            suppressEffects([G_EFFECT_TYPE.SQUEAL, G_EFFECT_TYPE.NOCTURNAL, G_EFFECT_TYPE.LYCAN, G_EFFECT_TYPE.GROWL]);
            stats = G_CREATE_OBJECT(G_ICON.ARCTIC_BEAR, orgStats[OBJECT_NAME]);
            stats[OBJECT_SUB_TYPE] = orgStats[OBJECT_SUB_TYPE];
            break;
        }
        heroObj.stats = stats;
        return me.tome.createEffect(type, level, period, icon);
    },
    updateEffect = function(effect, steps){
        effect[EFFECT_PERIOD] -= steps;
        if (effect[EFFECT_PERIOD] > 0){
            return true;
        }
        destroyEffect(effect);
        return false;
    },
    suppressEffects = function(arr){
        var
        remain = [],
        effect, a, al;
        loop1:
        for(var i=0,l=effects.length; i<l; i++){
            effect = effects[i];
            for (a=0,al=arr.length; a<al; a++){
                if (arr[a] === effect[OBJECT_SUB_TYPE]) continue loop1;
            }
            remain.push(effect);
        }
        if (remain.length !== effects.length){
            effects.length = 0;
            Array.prototype.push.apply(effects, remain);
        }
    },
    destroyEffect = function(effect){
        var orgStats = stats;
        switch(effect[OBJECT_SUB_TYPE]){
        case G_EFFECT_TYPE.SQUEAL:
        case G_EFFECT_TYPE.NOCTURNAL:
        case G_EFFECT_TYPE.LYCAN:
        case G_EFFECT_TYPE.GROWL:
            stats = G_CREATE_OBJECT(G_HERO_ICON[orgStats[OBJECT_SUB_TYPE]], orgStats[OBJECT_NAME]);
            break;
        }
        heroObj.stats = stats;
    };

    me.use('tome');

    me.create = function(ent, data){
        data = me.base.create.call(this, ent, data);

        data.font = this.smallDevice ? data.fontSmall : data.fontBig;
        data.activated = '';
        return data;
    };

    me.init = function(level){
        heroObj = this.mortal;
        appearance = heroObj.appearance;
        stats = heroObj.stats;
        effects = heroObj.effects;
        bag = heroObj.bag;
        tome = heroObj.tome;
        objects = this.objects;
        flags = this.flags;
        ai = this.ai;
        
        var targets = appearance[HERO_ENEMIES];

        if (targets && targets.length){
            this.go('showInfo', {targetId: targets[0], context:G_CONTEXT.WORLD});
        }
        currStats = []; // level up will update currStats
        me.calcStats.call(this, level, true);
        me.move(this.mortalLoc);

        return heroObj;
    };

    me.exit = function(){
        heroObj.appearance = appearance;
        heroObj.stats = stats;
        heroObj.effects = effects;
        heroObj.bag = bag;
        heroObj.tome = tome;
        return heroObj;
    };

    me.step = function(steps){
        var
        remain = [],
        target, curr,
        magic, cooldown,
        i,l;

        for(i=0,l=effects.length; i<l; i++){
            magic = effects[i];
            if (!magic) continue;
            if (updateEffect(magic, steps)){
                remain.push(magic);
            }
        }
        if (effects.length !== remain.length){
            effects = remain;
            me.calcStats.call(this, appearance[HERO_LEVEL]);
        }

        for(i=0, l=tome.length; i<l; i++){
            magic = tome[i];
            if (!magic) continue;
            cooldown = magic[SPELL_COOLDOWN];
            if (cooldown) {
                cooldown -= steps;
                if (cooldown < 0) cooldown = 0;
            }
            magic[SPELL_COOLDOWN] = cooldown;
        }

        restoreStat(OBJECT_PATK, HERO_PATK, steps);
        restoreStat(OBJECT_RATK, HERO_RATK, steps);
        restoreStat(OBJECT_DEF, HERO_DEF, steps);
        restoreStat(OBJECT_WILL, HERO_WILL, steps);
    };

    me.battle = function(id){
        me.setEngaged(id);

        var
        target = objects[id],
        ranged = me.carryRanged(),
        HERO_ATK = ranged ? HERO_RATK : HERO_PATK,
        atk = appearance[HERO_ATK],
        def = target[CREEP_PDEF],
        ret = [];


        if (atk > def) {
            ai.incrHp(id, -1);
            ret.push([id, OBJECT_HP, -1]);
        }else{
            ret.push([id, OBJECT_HP, 0]);
        }

        me.incrAtk(-def);
        ret.push([position, ranged ? OBJECT_RATK : OBJECT_PATK, -def]);

        return ret;
    };

    me.flee = function(){
        var targets = appearance[HERO_ENEMIES]
        if (!targets || !targets.length) return false; // return error?

        var
        roll = G_D20_ROLL(),
        total = roll + currStats[OBJECT_DEX],
        target, i, l;

        for (i=0,l=targets.length; i<l; i++){
            target = objects[targets[i]];
            if (total <= target[CREEP_ATK]) {
                return [false, G_MSG.FLEE_LOST
                        .replace('TOTAL', total)
                        .replace('ROLL', roll)
                        .replace('DEX', currStats[OBJECT_DEX])
                        .replace('NAME', target[OBJECT_NAME])
                        .replace('ATK', target[CREEP_ATK])
                        .replace('HP', 1)];
            }
        }

        for (i=0,l=targets.length; i<l; i++){
            flags[targets[i]] = G_UI.FLAG;
        }
        me.clearEngaged();
        return [true, G_MSG.FLEE_WIN
            .replace('TOTAL', total)
            .replace('ROLL', roll)
            .replace('DEX', currStats[OBJECT_DEX])];
    };

    me.move = function(pos){
        delete objects[position];
        position = pos;
        objects[pos] = currStats;
    };

    me.recoverBody = function(body){
        var
        recovered = true,
        slot;

        for (var i=HERO_HELM,l=HERO_QUIVER; i<=l; i++){
            slot = body[i];
            if (slot){
                recovered = me.equipItem.call(this, slot);
                if (!recovered) recovered = me.putIntoBag(slot[0]);
            }
            if (!recovered) return recovered;
        }
        me.incrGold(body[HERO_GOLD]);
        if (body[HERO_BAG_CAP] > appearance[HERO_BAG_CAP]) appearance[HERO_BAG_CAP] = body[HERO_BAG_CAP];
        if (body[HERO_TOME_CAP] > appearance[HERO_TOME_CAP]) appearance[HERO_TOME_CAP] = body[HERO_TOME_CAP];
        return recovered;
    };

    me.incrGold = function(count){ appearance[HERO_GOLD] += count; };
    me.getGold = function(){return appearance[HERO_GOLD]; };

    me.convertEquipId = function(text){
        switch(text){
        case 'helm': return HERO_HELM;
        case 'armor': return HERO_ARMOR;
        case 'main': return HERO_MAIN;
        case 'off': return HERO_OFF;
        case 'ringL': return HERO_RINGL;
        case 'ringR': return HERO_RINGR;
        case 'amulet': return HERO_AMULET;
        case 'quiver': return HERO_QUIVER;
        }
    };
    me.equipItem = function(item){
        if (!item) return false;

        var
        stat = item[0],
        count = item[1];

        switch(stat[OBJECT_TYPE]){
        case G_OBJECT_TYPE.WEAPON:
            if (2 === stat[WEAPON_HANDED]){
                if (appearance[HERO_MAIN] || appearance[HERO_OFF]) return false;
                appearance[HERO_MAIN] = appearance[HERO_OFF] = item;
            }else{
                if (!appearance[HERO_MAIN]){
                    appearance[HERO_MAIN] = item;
                } else if (G_HERO_CLASS.BARBARIAN === currStats[OBJECT_SUB_TYPE] && !appearance[HERO_OFF]){
                    appearance[HERO_OFF] = item;
                } else {
                    return false;
                }
            }
            break;
        case G_OBJECT_TYPE.ARMOR:
            switch(stat[OBJECT_SUB_TYPE]){
            case G_ARMOR_TYPE.HELM:
                if (appearance[HERO_HELM]) return false;
                appearance[HERO_HELM] = item;
                break;
            case G_ARMOR_TYPE.ARMOR:
                if (appearance[HERO_ARMOR]) return false;
                appearance[HERO_ARMOR] = item;
                break;
            case G_ARMOR_TYPE.SHEILD:
                if (appearance[HERO_OFF]) return false;
                appearance[HERO_OFF] = item;
                break;
            default:
                return false;
            }
            break;
        case G_OBJECT_TYPE.JEWEL:
            switch(stat[OBJECT_SUB_TYPE]){
            case G_JEWEL_TYPE.RING:
                if (!appearance[HERO_RINGL]){
                    appearance[HERO_RINGL] = item;
                } else if (!appearance[HERO_RINGR]){
                    appearance[HERO_RINGR] = item;
                } else {
                    return false;
                }
                break;
            case G_JEWEL_TYPE.AMULET:
                if (appearance[HERO_AMULET]) return false;
                appearance[HERO_AMULET] = item;
                break;
            default:
                return false;
            }
            break;
        case G_OBJECT_TYPE.AMMO:
            var ammo = appearance[HERO_QUIVER];
            if (!ammo) appearance[HERO_QUIVER] = item;
            else if (ammo[0][OBJECT_ICON] === stat[OBJECT_ICON]) ammo[1] += count;
            else return false;
            break;
        default:
            return false;
        }
        me.calcStats.call(this, appearance[HERO_LEVEL]);
        return true;
    };

    me.unequipItem = function(slot){
        if (!slot) return false;

        var
        ret = false,
        index = slot[2],
        equipped;

        for (var i=HERO_HELM,l=HERO_QUIVER; i<=l; i++){
            equipped = appearance[i];
            if (equipped && equipped[2] === index){
                delete appearance[i];
                ret = true;
            }
        }

        me.calcStats.call(this, appearance[HERO_LEVEL]);
        return ret;
    };
    me.isItemEquipped = function(slot){
        if (!slot) return false;

        var
        index = slot[2],
        equipped;

        for (var i=HERO_HELM,l=HERO_QUIVER; i<=l; i++){
            equipped = appearance[i];
            if (equipped && equipped[2] === index){
                return true;
            }
        }

        return false;
    };
    me.getEquippedItem = function(id){
        var slot = appearance[id];

        if (!slot || !slot[0]) return null;
        return slot[0].slice();
    };

    me.putIntoBag = function(item){
        var
        cap = me.getBagCap(),
        stack, stat, i, l;

        switch(item[OBJECT_TYPE]){
            case G_OBJECT_TYPE.MONEY:
                me.incrGold(1);
                return true;
            case G_OBJECT_TYPE.ARMOR:
            case G_OBJECT_TYPE.WEAPON:
            case G_OBJECT_TYPE.JEWEL:
                break;
            case G_OBJECT_TYPE.SCROLL:
                if (G_SCROLL_TYPE.MENUSCRIPT === item[OBJECT_SUB_TYPE]){
                    break;
                }
                // through
            default:
                for(i=0,l=bag.length; i<l; i++){
                    stack = bag[i];
                    if (!stack) continue;
                    stat = stack[0]; 
                    if (stat[OBJECT_ICON] === item[OBJECT_ICON]){
                        stack[1]++;
                        return true;
                    }
                }
                break;
        }
        for(i=0,l=bag.length; i<l; i++){
            stack = bag[i];
            if (!stack){
                bag[i] = [item, 1, i];
                return true;
            }
        }
        if (cap <= bag.length) return false;
        bag.push([item, 1, bag.length]);
        return true;
    };

    me.removeFromBag = function(id){
        var
        item = bag[id],
        stat = item[0],
        count = item[1];

        count--;
        if (count < 1) delete bag[id];
        else item[1] = count;

        return stat;
    };

    me.putIntoTome = function(spellId){
        if (!spellId){
            var spellInfo = pick(G_SPELL_RATE, currStats[OBJECT_LUCK], this.currentLevel);
            //spellId === G_ICON
            spellId = spellInfo[DROP_ID];
        }
        return tome.push(me.tome.createSpell(spellId, currStats[OBJECT_SUB_TYPE]));
    };

    me.bury = function(god){
        me.clearEngaged();
        god.toHeaven(appearance, currStats);
    };

    me.calcStats = function(lvl, isInit){
        var level = appearance[HERO_LEVEL];
        if (level < lvl){
            appearance[HERO_LEVEL] = level = lvl;
        }
        currStats = stats.slice();
        currStats[OBJECT_PATK] = currStats[OBJECT_RATK] = 0

        var i,a,al,equip,item;
        for(i=OBJECT_WILL; i<OBJECT_PATK; i++){
            currStats[i] = Ceil(currStats[i]*level); // negative is ok
        }
        for(a=HERO_HELM; a<HERO_QUIVER; a++){
            equip = appearance[a];
            if (!equip) continue;
            item = equip[0];
            for(i=OBJECT_HP; i<=OBJECT_EARTH; i++){
                currStats[i] += item[i];
            }
        }
        for(a=0,al=effects.length; a<al; a++){
            equip = effects[a];
            if (!equip) continue;
            for(i=OBJECT_HP; i<=OBJECT_EARTH; i++){
                currStats[i] += equip[i];
            }
        }
        currStats[OBJECT_PATK] = Ceil((currStats[OBJECT_PATK] > 0 ? currStats[OBJECT_PATK] : stats[OBJECT_PATK])*currStats[OBJECT_STR]);
        currStats[OBJECT_RATK] = Ceil((currStats[OBJECT_RATK] > 0 ? currStats[OBJECT_RATK] : stats[OBJECT_RATK])*currStats[OBJECT_DEX]);
        currStats[OBJECT_LEVEL] = level;

        // make sure dun exceed max
        restoreStat(OBJECT_PATK, HERO_PATK, 0);
        restoreStat(OBJECT_RATK, HERO_RATK, 0);
        restoreStat(OBJECT_DEF, HERO_DEF, 0);
        restoreStat(OBJECT_WILL, HERO_WILL, 0);

        me.tome.upgradeSpell.call(this, me.getTome(), currStats[OBJECT_FIRE], currStats[OBJECT_AIR], currStats[OBJECT_WATER], currStats[OBJECT_EARTH], isInit);

        objects[position] = currStats;

        return currStats;
    };

    me.selectSpell = function(spell){
        if (spell && spell[SPELL_COOLDOWN]) return;
        selectedSpell = spell;
    };

    me.castSpell = function(id){
        var spell = selectedSpell;
        if (!spell || spell[SPELL_COOLDOWN]) return false;

        var hp = me.getPosition();

        // some spell can only apply to hero
        switch(spell[OBJECT_SUB_TYPE]){
        case G_SPELL_TYPE.WHIRLWIND:
        case G_SPELL_TYPE.POISON_BLADE:
        case G_SPELL_TYPE.SQUEAL:
        case G_SPELL_TYPE.NOCTURNAL:
        case G_SPELL_TYPE.LYCAN:
        case G_SPELL_TYPE.GROWL:
            if (hp !== id) id = hp;
        }

        var
        object = objects[id],
        objectType = object ? object[OBJECT_TYPE] : undefined;
                
        if (object && (G_OBJECT_TYPE.NPC === objectType || 
            G_OBJECT_TYPE.KEY === objectType || 
            G_OBJECT_TYPE.ENV === objectType)) return false;

        var cost = spell[SPELL_COST];

        switch (me.affordableSpell(spell)){
        case OBJECT_HP:
            me.incrHp(-cost);
            break;
        case OBJECT_WILL:
            me.incrWill(-cost);
            break;
        case OBJECT_PATK:
            me.incrAtk(-cost);
            break;
        case OBJECT_RATK:
            me.incrAtk(-cost);
            break;
        case OBJECT_DEF:
            me.incrDef(-cost);
            break;
        default: return false;
        }

        this.go('forceRefresh'); // TODO: find a better way to show cooldown counter

        // return true from here onwards
        spell[SPELL_COOLDOWN] = spell[SPELL_RELOAD]; // set cooldown;

        // deselect spell, major fail still need the spell to be selected
        selectedSpell = undefined;

        var
        map = this.map,
        targets = [],
        damages = [],
        branches = {
            type:'castEfx',
            targets:[id],
            spells:[spell[OBJECT_ICON]],
            callback: 'startEffect',
            event: {
                type:'battleText',
                targets:[[hp, spell[SPELL_ATTR], -cost]],
                callback: undefined,
                event: undefined
            }
        },
        branch = branches.event,
        castStr = spell[SPELL_DAMAGE];

        switch(spell[OBJECT_SUB_TYPE]){
        case G_SPELL_TYPE.WHIRLWIND:
            var
            touched = this.getAllTouched(id),
            contact, contactId;

            for(var i=0,l=touched.length; i<l; i++){
                contactId = touched[i];
                contact = objects[contactId];
                if (!contact) continue;
                switch(contact[OBJECT_TYPE]){
                case G_OBJECT_TYPE.CREEP:
                    if (castStr > contact[CREEP_MDEF]){
                        targets.push(contactId);
                        damages.push([contactId, OBJECT_HP, -1]);
                        ai.incrHp(contactId, -1);
                    }
                    break;
                case G_OBJECT_TYPE.CHEST:
                    if (contact[OBJECT_SUB_TYPE] || contact[CHEST_ITEM]){
                        targets.push(contactId);
                    }
                    break;
                case G_OBJECT_TYPE.HERO:
                case G_OBJECT_TYPE.ENV:
                case G_OBJECT_TYPE.KEY:
                    break;
                default:
                    targets.push(contactId);
                    break;
                }
                ai.reveal(contactId);
            }
            break;
        case G_SPELL_TYPE.POISON_BLADE:
            var level = spell[OBJECT_LEVEL];
            effects.push(createEffect(G_EFFECT_TYPE.POISON_BLADE, spell[OBJECT_LEVEL], 3 * level, spell[OBJECT_ICON]));
            break;
        case G_SPELL_TYPE.SQUEAL:
            var level = spell[OBJECT_LEVEL];
            effects.push(createEffect(G_EFFECT_TYPE.SQUEAL, spell[OBJECT_LEVEL], 5 * level, spell[OBJECT_ICON]));
            break;
        case G_SPELL_TYPE.NOCTURNAL:
            var level = spell[OBJECT_LEVEL];
            effects.push(createEffect(G_EFFECT_TYPE.NOCTURNAL, spell[OBJECT_LEVEL], 5 * level, spell[OBJECT_ICON]));
            break;
        case G_SPELL_TYPE.LYCAN:
            var level = spell[OBJECT_LEVEL];
            effects.push(createEffect(G_EFFECT_TYPE.LYCAN, spell[OBJECT_LEVEL], 5 * level, spell[OBJECT_ICON]));
            break;
        case G_SPELL_TYPE.GROWL:
            var level = spell[OBJECT_LEVEL];
            effects.push(createEffect(G_EFFECT_TYPE.GROWL, spell[OBJECT_LEVEL], 5 * level, spell[OBJECT_ICON]));
            break;
        case G_SPELL_TYPE.GAZE:
            if (!this.currentLevel) return false;
            if (!object){
                map[id] |= G_TILE_TYPE.CREEP;
                map[id] &= G_TILE_TYPE.SHOW;
                objects[id] = ai.spawnCreep(currStats[OBJECT_LEVEL]);
                me.setEngaged(id);
                this.recalHints();
            }else{
                flags[id] = G_UI.FLAG;
                ai.reveal(id);
            }
            break;
        case G_SPELL_TYPE.FIREBALL:
            if (object){
                switch(objectType){
                case G_OBJECT_TYPE.CREEP:
                    ai.incrHp(id, -1);
                    targets.push(id);
                    damages.push([id, OBJECT_HP, -1]);
                    break;
                case G_OBJECT_TYPE.HERO:
                case G_OBJECT_TYPE.ENV:
                case G_OBJECT_TYPE.KEY:
                    // ignore
                    break;
                case G_OBJECT_TYPE.CHEST:
                    if (object[OBJECT_SUB_TYPE] || object[CHEST_ITEM]){
                        targets.push(id);
                    }
                    break;
                default:
                    targets.push(id);
                    break;
                }
            }
            ai.reveal(id);
            break;
        }

        me.calcStats.call(this, appearance[HERO_LEVEL]);

        if (targets && targets.length){
            branch.callback = 'startEffect',
            branch.event = {
                type: 'damageEfx',
                targets:targets,
                callback: 'startEffect',
                event: {
                    type: 'battleText',
                    targets: damages,
                    callback: 'battleEnd',
                    event: targets.slice()
                }
            };
        }
        this.go('startEffect', branches);
        return true;
    };

    me.affordableSpell = function(spell){
        var cost = spell[SPELL_COST];

        switch (spell[SPELL_ATTR]){
        case OBJECT_HP:
            if (appearance[HERO_HP] < cost) return false;
            return OBJECT_HP;
        case OBJECT_WILL:
            if (appearance[HERO_WILL] < cost) return false;
            return OBJECT_WILL;
        case OBJECT_PATK:
            if (appearance[HERO_PATK] < cost) return false;
            return OBJECT_PATK;
        case OBJECT_RATK:
            if (appearance[HERO_RATK] < cost) return false;
            return OBJECT_RATK;
        case OBJECT_DEF:
            if (appearance[HERO_DEF] < cost) return false;
            return OBJECT_DEF;
        }
        return false;
    };

    me.isDead = function(){ return appearance[HERO_HP] < 1; };
    me.incrHp = function(inc){return restoreStat(OBJECT_HP, HERO_HP, inc);};
    me.incrWill = function(inc){return restoreStat(OBJECT_WILL, HERO_WILL, inc);};
    me.incrAtk = function(inc){
        if (me.carryRanged()) return restoreStat(OBJECT_RATK, HERO_RATK, inc);
        return restoreStat(OBJECT_PATK, HERO_PATK, inc);
    };
    me.incrDef = function(inc){return restoreStat(OBJECT_DEF, HERO_DEF, inc);};

    me.getHp = function(){ return appearance[HERO_HP]; };
    me.getWill = function(){ return appearance[OBJECT_WILL]; };
    me.getDef = function(){ return appearance[HERO_DEF]; };
    me.getAtk = function(){
        if (me.carryRanged()) return appearance[HERO_RATK];
        return appearance[HERO_PATK];
    };
    me.getSelectedSpell = function(){ return selectedSpell; };
    me.getPosition = function(){ return position; };
    me.getLastPortal = function(){ return appearance[HERO_PORTAL]; };
    me.getLastWayPoint = function(){ return appearance[HERO_WAYPOINT]; };
    me.setLastPortal = function(level){ appearance[HERO_PORTAL] = level; };
    me.setLastWayPoint = function(level){ if (appearance[HERO_WAYPOINT] < level) appearance[HERO_WAYPOINT] = level; };
    me.getJob = function(){ return currStats[OBJECT_SUB_TYPE]; };
    me.getBag = function(){ return bag; };
    me.getBagCap = function(){ return appearance ? appearance[HERO_BAG_CAP] : 4; };
    me.getItem = function(id){ return bag[id]; }
    me.getTome = function(){ return tome; };
    me.getTomeCap = function(){ return appearance ? appearance[HERO_TOME_CAP] : 4; };
    me.equal = function(obj){ return obj[OBJECT_ICON] === currStats[OBJECT_ICON] && obj[OBJECT_TYPE] === currStats[OBJECT_TYPE]; };
    me.getStat = function(stat){ return currStats[stat]; };
    me.carryRanged = function(){
        var
        mainSlot = appearance[HERO_MAIN],
        main = mainSlot ? mainSlot[0] : null;

        if (!main) return false;

        switch(main[OBJECT_SUB_TYPE]){
        case G_WEAPON_TYPE.SWORD:
        case G_WEAPON_TYPE.AXE:
        case G_WEAPON_TYPE.SCEPTER:
            return false;
        }
        return true;
    };
    me.isEngaged = function(id){
        var targets = appearance[HERO_ENEMIES];
        if (!targets) return false;
        return -1 !== targets.indexOf(id);
    };
    me.clearEngaged = function(){
        var targets = appearance[HERO_ENEMIES];
        if (!targets) return;
        targets.length = 0;
    };
    me.removeEngaged = function(id){
        var targets = appearance[HERO_ENEMIES];
        if (!targets) return;
        var index = targets.indexOf(id);
        if (-1 === index) return;
        targets.splice(index, 1);
    };
    me.getEngaged = function(){
        var targets = appearance[HERO_ENEMIES];
        if (!targets) return [];
        return targets.slice();
    };
    me.setEngaged = function(engaged){
        var
        targets = appearance[HERO_ENEMIES],
        validList = [];

        if (!targets) targets = [];
        if (!engaged.length) engaged = [engaged];
        var id, object;
        for(var i=0,l=engaged.length; i<l; i++){
            id = engaged[i];
            object = objects[id];
            if (G_OBJECT_TYPE.CREEP === object[OBJECT_TYPE] && -1 === targets.indexOf(id)) validList.push(id);
        }

        if (validList.length) appearance[HERO_ENEMIES] = targets.concat(validList);
    };

    me.resize = function(ent, width, height){
        var
        com = ent.getComponent(name),
        comWin = ent.getComponent(com.win);

        if (comWin.maximized){
            com.layout = me.createMeshUIFromTemplate(com.maxMeshUI, width, height);
        }else{
            com.layout = me.createMeshUIFromTemplate(com.minMeshUI, width, height);
        }

        return [com.layout.w, com.layout.h];
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
});
