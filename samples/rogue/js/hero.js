pico.def('hero', 'picUIContent', function(){
    var
    me = this,
    name = me.moduleName,
    Floor = Math.floor, Ceil = Math.ceil, Round = Math.round, Random = Math.random,
    objects, flags, ai,
    position, selectedSpell,
    heroObj,
    appearance, stats, effects, bag, tome,
    currStats,
    slotText2Id = function(text){
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
    },
    onCustomBound = function(ent, rect, ui, tileScale){
        var id = ui.userData.id;

        if ('custom1Label' === id) id = 'goldLabel';
        else if ('custom2Label' === id) id = 'skullLabel';
        else if ('custom1' === id) id = 'gold';
        else if ('custom2' === id) id = 'skull';

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
        ts = tss['default'],
        ss = tss['spells'];

        if ('custom1Label' === id) id = 'goldLabel';
        else if ('custom2Label' === id) id = 'skullLabel';
        else if ('custom1' === id) id = 'gold';
        else if ('custom2' === id) id = 'skull';

        switch(id){
        case 'avatar':
            ts.draw(ctx, currStats[OBJECT_ICON], rect[0], rect[1], rect[2], rect[3]);
            break;
        case 'name':
            me.fillIconText(ctx, ts, currStats[OBJECT_NAME], rect, tileScale);
            break;
        case 'desc':
            if (com.activated){
                var selectedObj = effects[com.activated];
                if (!selectedObj) {
                    selectedObj = appearance[slotText2Id(com.activated)];
                    if (selectedObj) selectedObj = selectedObj[0];
                }
                if (selectedObj) me.fillIconText(ctx, ts, selectedObj[OBJECT_DESC], rect, tileScale);
            }
            break;
        case 'level':
            me.fillIconText(ctx, ts, ''+currStats[OBJECT_LEVEL], rect, tileScale);
            break;
        case 'str':
            me.fillIconText(ctx, ts, ''+currStats[OBJECT_STR], rect, tileScale);
            break;
        case 'dex':
            me.fillIconText(ctx, ts, ''+currStats[OBJECT_DEX], rect, tileScale);
            break;
        case 'luck':
            me.fillIconText(ctx, ts, ''+currStats[OBJECT_LUCK], rect, tileScale);
            break;
        case 'will':
            me.fillIconText(ctx, ts, ''+currStats[OBJECT_WILL], rect, tileScale);
            break;
        case 'hp':
            // draw hp
            var iconText='HP:';
            for(var i=0, l=stats[OBJECT_HP]; i<l; i++){
                iconText += ' `'+((i < currStats[OBJECT_HP]) ? G_UI.HP : G_UI.HP_EMPTY);
            }
            me.fillIconText(ctx, ts, iconText, rect, tileScale);
            break;
        case 'goldLabel':
            me.fillIconText(ctx, ts, 'Gold `'+G_UI.GOLD, rect, tileScale);
            break;
        case 'gold':
            me.fillIconText(ctx, ts, ''+currStats[HERO_GOLD], rect, tileScale);
            break;
        case 'skullLabel':
            me.fillIconText(ctx, ts, 'Piety `'+G_UI.SKULL, rect, tileScale);
            break;
        case 'skull':
            me.fillIconText(ctx, ts, ''+currStats[HERO_PIETY], rect, tileScale);
            break;
        case 'patk':
            me.fillIconText(ctx, ts, ''+currStats[OBJECT_PATK], rect, tileScale);
            break;
        case 'ratk':
            me.fillIconText(ctx, ts, ''+currStats[OBJECT_RATK], rect, tileScale);
            break;
        case 'pdef':
            me.fillIconText(ctx, ts, ''+currStats[OBJECT_DEF], rect, tileScale);
            break;
        case 'helm':
        case 'armor':
        case 'main':
        case 'off':
        case 'ringL':
        case 'ringR':
        case 'amulet':
        case 'quiver':
            var item = appearance[slotText2Id(id)];
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
            selectedObj = appearance[slotText2Id(id)];
        }

        if (selectedObj){
            com.activated = id;
            return true;
        }
        return false;
    },
    onCustomUI = function(){
        switch(Array.prototype.shift.call(arguments)){
        case me.CUSTOM_BOUND: return onCustomBound.apply(this, arguments); break;
        case me.CUSTOM_DRAW: return onCustomDraw.apply(this, arguments); break;
        case me.CUSTOM_CLICK: return onCustomClick.apply(this, arguments); break;
        case me.CUSTOM_BUTTON: return onCustomDraw.apply(this, arguments); break;
        }
    };

    me.create = function(ent, data){
        data = me.base.create.call(this, ent, data);

        data.font = this.smallDevice ? data.fontSmall : data.fontBig;
        data.activated = '';
        return data;
    };

    me.init = function(){
        heroObj = this.mortal;
        if (!heroObj){
            heroObj = this.god.createHero();
        }
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
        me.levelUp(this.deepestLevel);
        me.move(this.mortalLoc);

        return heroObj;
    };

    me.exit = function(){
        return heroObj;
    };

    me.step = function(steps){
        var spell, cooldown;
        for(var i=0, l=tome.length; i<l; i++){
            spell = tome[i];
            if (!spell) continue;
            cooldown = spell[SPELL_COOLDOWN];
            if (cooldown) {
                cooldown -= steps;
                if (cooldown < 0) cooldown = 0;
            }
            spell[SPELL_COOLDOWN] = cooldown;
        }
    };

    me.battle = function(id){
        me.setEngaged(id);

        var
        target = objects[id],
        creepName = target[OBJECT_NAME],
        roll = G_D20_ROLL(),
        atk = me.getAtk(),
        def = target[CREEP_PDEF],
        total = roll + atk,
        hit = total > def ? 1 : (0===roll ? 2 : 0),
        attackMsg = (hit ? MSG_ATTACK_WIN : MSG_ATTACK_LOST)
            .replace('NAME', creepName)
            .replace('TOTAL', total)
            .replace('ROLL', roll)
            .replace('ATK', atk)
            .replace('DEF', def)
            .replace('DMG', hit);

        if (ai.incrHp(id, -hit) < 1){
            attackMsg += MSG_CREEP_KILL;
        }

        return [false, [id], attackMsg];
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
                return [false, MSG_FLEE_LOST
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
        return [true, MSG_FLEE_WIN
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
                recovered = me.equipItem(slot);
                if (!recovered) recovered = me.putIntoBag(slot[0]);
            }
            if (!recovered) return recovered;
        }
        slot = body[HERO_GOLD];
        if (slot) me.incrMoney(slot[0], slot[1]);
        slot = body[HERO_PIETY];
        if (slot) me.incrMoney(slot[0], slot[1]);
        if (body[HERO_BAG_CAP] > appearance[HERO_BAG_CAP]) appearance[HERO_BAG_CAP] = body[HERO_BAG_CAP];
        if (body[HERO_TOME_CAP] > appearance[HERO_TOME_CAP]) appearance[HERO_TOME_CAP] = body[HERO_TOME_CAP];
        return recovered;
    };

    me.incrMoney = function(money, count){
        switch(money[OBJECT_SUB_TYPE]){
            case G_MONEY_TYPE.GOLD: appearance[HERO_GOLD][1] += count; break;
            case G_MONEY_TYPE.PIETY: appearance[HERO_PIETY][1] += count; break;
            default: return false;
        }

        return true;
    };

    me.equipItem = function(item, slot){
        if (!item || appearance[slot]) return false;

        var
        stat = item[0],
        count = item[1];

        switch(stat[OBJECT_TYPE]){
            case G_OBJECT_TYPE.WEAPON:
                if (HERO_OFF !== slot || HERO_MAIN !== slot) return false;
                if (G_HERO_CLASS.BARBARIAN === currStats[OBJECT_SUB_TYPE] && 
                    G_WEAPON_TYPE.BOW !== stat[OBJECT_SUB_TYPE] && G_WEAPON_TYPE.CROSSBOW !== stat[OBJECT_SUB_TYPE]){
                    appearance[slot] = item;
                    return true;
                }
                if (2 === stat[WEAPON_HANDED]){
                    if (appearance[HERO_MAIN] || appearance[HERO_OFF]) return false;
                    appearance[HERO_MAIN] = appearance[HERO_OFF] = item;
                    return true;
                }else{
                    if (appearance[HERO_MAIN]) return false;
                    appearance[HERO_MAIN] = item;
                    return true;
                }
                break;
            case G_OBJECT_TYPE.ARMOR:
                switch(stat[OBJECT_SUB_TYPE]){
                    case G_ARMOR_TYPE.HELM:
                        if (appearance[HERO_HELM]) return false;
                        appearance[HERO_HELM] = item;
                        return true;
                    case G_ARMOR_TYPE.ARMOR:
                        if (appearance[HERO_ARMOR]) return false;
                        appearance[HERO_ARMOR] = item;
                        return true;
                    case G_ARMOR_TYPE.SHEILD:
                        if (appearance[HERO_OFF]) return false;
                        appearance[HERO_OFF] = item;
                        return true;
                }
                return false;
            case G_OBJECT_TYPE.JEWEL:
                switch(stat[OBJECT_SUB_TYPE]){
                    case G_JEWEL_TYPE.RING:
                        if (HERO_RINGL !== slot || HERO_RINGR !== slot) return false;
                        appearance[slot] = item;
                        return true;;
                    case G_JEWEL_TYPE.AMULET:
                        if (appearance[HERO_AMULET]) return false;
                        appearance[HERO_AMULET] = item;
                        return true;
                }
                return false;
            case G_OBJECT_TYPE.AMMO:
                var ammo = appearance[HERO_QUIVER];
                if (!ammo) appearance[HERO_QUIVER] = item;
                else if (ammo[0][OBJECT_ICON] === stat[OBJECT_ICON]) ammo[1] += count;
                else return false;
                return true;
            default:
                return false;
        }
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

    me.putIntoBag = function(item){
        var
        cap = me.getBagCap(),
        stack, stat, i, l;

        switch(item[OBJECT_TYPE]){
            case G_OBJECT_TYPE.MONEY:
                me.incrMoney(item, 1);
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

    me.bury = function(god){
        me.clearEngaged();
        god.toHeaven(appearance, currStats);
    };

    me.levelUp = function(lvl){
        if (currStats[OBJECT_LEVEL] > lvl) return currStats;
        if (!currStats.length) currStats = stats.slice();
        for(var i=OBJECT_WILL; i<OBJECT_VEG; i++){
            currStats[i] = Ceil(currStats[i]*lvl); // negative is ok
        }
        currStats[OBJECT_LEVEL] = lvl;
        return currStats;
    };

    me.selectSpell = function(spell){
        if (spell && spell[SPELL_COOLDOWN]) return;
        selectedSpell = spell;
    };

    me.castSpell = function(id){
        var spell = selectedSpell;
        if (!spell || spell[SPELL_COOLDOWN]) return false;
        else this.go('forceRefresh'); // TODO: find a better way to show cooldown counter

        var
        map = this.map,
        hp = me.getPosition(),
        object = objects[id],
        objectType = object ? object[OBJECT_TYPE] : undefined;
                
        if (object && (G_OBJECT_TYPE.NPC === objectType || 
            G_OBJECT_TYPE.KEY === objectType || 
            G_OBJECT_TYPE.ENV === objectType)) return false;

        // some spell can only apply to hero
        switch(spell[OBJECT_SUB_TYPE]){
        case G_SPELL_TYPE.WHIRLWIND:
        case G_SPELL_TYPE.POISON_BLADE:
            if (hp !== id) return false;
        }

        // return true from here onwards
        spell[SPELL_COOLDOWN] = spell[SPELL_RELOAD]; // set cooldown;

        var
        castPt = G_D20_ROLL(),
        totalCastPt = castPt + currStats[OBJECT_WILL];

        if (0 === castPt){
            this.go('forgetSpell');
            this.go('attack', [true, [], MSG_CAST_FAILURE_MAJOR]);
            return true; // spell cast
        }

        if (totalCastPt < spell[SPELL_DIFFICULTY]){
            this.go('attack', [true, [], MSG_CAST_FAILURE_MINOR
                .replace('TOTAL', totalCastPt)
                .replace('ROLL', castPt)
                .replace('STAT', currStats[OBJECT_WILL])
                .replace('DIFF', spell[SPELL_DIFFICULTY])]);
            return true; // spell cast
        }

        // deselect spell 
        selectedSpell = undefined;

        var
        targets = [],
        isSpell = true,
        castStr = castPt + spell[SPELL_STRENGTH],
        info = MSG_CAST_SUCCEED.replace('TOTAL',castStr).replace('ROLL',castPt).replace('STR',spell[SPELL_STRENGTH]);

        switch(spell[OBJECT_SUB_TYPE]){
        case G_SPELL_TYPE.WHIRLWIND:
            var
            touched = this.getAllTouched(id),
            contact, contactId, creepCount=0, chestCount=0;

            for(var i=0,l=touched.length; i<l; i++){
                contactId = touched[i];
                contact = objects[contactId];
                if (!contact) continue;
                switch(contact[OBJECT_TYPE]){
                case G_OBJECT_TYPE.CREEP:
                    if (castStr > contact[CREEP_MDEF]){
                        me.setEngaged(contactId);
                        targets.push(contactId);
                        ai.incrHp(contactId, -1);
                        ai.bury(contactId);
                        info += MSG_CAST_WHIRLWIND_SUCCEED.replace('DEF', contact[CREEP_MDEF]).replace('NAME', contact[OBJECT_NAME]); 
                    }else{
                        info += MSG_CAST_WHIRLWIND_FAILURE.replace('DEF', contact[CREEP_MDEF]).replace('NAME', contact[OBJECT_NAME]); 
                    }
                    creepCount++;
                    break;
                case G_OBJECT_TYPE.CHEST:
                    if (contact[OBJECT_SUB_TYPE] || contact[CHEST_ITEM]){
                        objects[contactId] = G_CREATE_OBJECT(G_ICON.CHEST_EMPTY);
                        chestCount++;
                        targets.push(contactId);
                    }
                    break;
                default:
                    delete objects[contactId];
                    break;
                }
                ai.reveal(contactId);
            }
            if (chestCount) info += MSG_CAST_DESTROY_CHEST.replace('COUNT', chestCount);
            if (!creepCount && !chestCount) info += MSG_CAST_VOID; 
            break;
        case G_SPELL_TYPE.POISON_BLADE:
            var efx = G_CREATE_OBJECT(G_ICON.EFX_POISON_BLADE);
            efx[OBJECT_ICON] = spell[OBJECT_ICON];
            efx[OBJECT_LEVEL] = spell[OBJECT_LEVEL];
            effects.push(efx);
            info += MSG_CAST_POISONBLADE;
            break;
        case G_SPELL_TYPE.GAZE:
            if (!this.currentLevel) return false;
            if (!object){
                map[id] |= G_TILE_TYPE.CREEP;
                objects[id] = ai.spawnCreep(this.deepestLevel);
                this.recalHints();
                me.setEngaged(id);
                targets.push(id);
                isSpell = false;
                info += MSG_CAST_GAZE_FAILURE;
            }else{
                flags[id] = G_UI.FLAG;
                info += MSG_CAST_GAZE_SUCCEED;
            }
            ai.reveal(id);
            break;
        case G_SPELL_TYPE.FIREBALL:
            if (object){
                switch(objectType){
                case G_OBJECT_TYPE.CREEP:
                    ai.incrHp(id, -1);
                    info += MSG_CAST_FIREBALL_SUCCEED.replace('NAME', object[OBJECT_NAME]);
                    if (ai.bury(id)){
                        info += MSG_CREEP_KILL;
                    }else{
                        info += MSG_CREEP_ALIVE;
                    }
                    targets.push(id);
                    break;
                case G_OBJECT_TYPE.HERO:
                    // ignore
                    break;
                case G_OBJECT_TYPE.CHEST:
                    if (object[OBJECT_SUB_TYPE] || object[CHEST_ITEM]){
                        objects[id] = G_CREATE_OBJECT(G_ICON.CHEST_EMPTY);
                        targets.push(id);
                        info += MSG_CAST_DESTROY_CHEST.replace('COUNT', 1);
                    }
                    break;
                default:
                    delete objects[id];
                    break;
                }
            }
            ai.reveal(id);
            break;
        }
        this.go('hideInfo');
        this.go('startEffect', {
            type:'castEfx',
            targets:[id],
            spells:[spell[OBJECT_ICON]],
            callback:'attack',
            event:[isSpell, targets, info]
        });
        return true;
    };

    me.incrHp = function(inc) {
        var hp = currStats[OBJECT_HP];
        hp += inc;
        if (hp > stats[OBJECT_HP]) hp = stats[OBJECT_HP];
        currStats[OBJECT_HP] = hp;
        return hp;
    };

    me.rejuvenate = function() {
        currStats[OBJECT_HP] = stats[OBJECT_HP];
    };

    me.getSelectedSpell = function(){ return selectedSpell; };
    me.getPosition = function(){ return position; };
    me.getLastPortal = function(){ return appearance[HERO_PORTAL]; };
    me.getLastWayPoint = function(){ return appearance[HERO_WAYPOINT]; };
    me.setLastPortal = function(level){ appearance[HERO_PORTAL] = level; };
    me.setLastWayPoint = function(level){ if (appearance[HERO_WAYPOINT] < level) appearance[HERO_WAYPOINT] = level; };
    me.getJob = function(){ return currStats[OBJECT_TYPE]; };
    me.getBag = function(){ return bag; };
    me.getBagCap = function(){ return appearance[HERO_BAG_CAP]; };
    me.getItem = function(id){ return bag[id]; }
    me.getTome = function(){ return tome; };
    me.getTomeCap = function(){ return appearance[HERO_TOME_CAP]; };
    me.putIntoTome = function(spell){ return tome.push(spell); };
    me.equal = function(obj){ return obj[OBJECT_ICON] === currStats[OBJECT_ICON] && obj[OBJECT_TYPE] === currStats[OBJECT_TYPE]; };
    me.getHp = function(){ return currStats[OBJECT_HP]; };
    me.getLuck = function(){ return currStats[OBJECT_LUCK]; };
    me.getWill = function(){ return currStats[OBJECT_WILL]; };
    me.getDef = function(){ return currStats[OBJECT_DEF]; };
    me.getAtk = function(){
        var
        mainSlot = appearance[HERO_MAIN],
        main = mainSlot ? mainSlot[0] : null;

        if (!main) return currStats[OBJECT_PATK];

        switch(main[OBJECT_SUB_TYPE]){
        case G_WEAPON_TYPE.SWORD:
        case G_WEAPON_TYPE.AXE:
        case G_WEAPON_TYPE.SCEPTER:
            return currStats[OBJECT_PATK];
        case G_WEAPON_TYPE.THROW:
        case G_WEAPON_TYPE.BOW:
        case G_WEAPON_TYPE.CROSSBOW:
            return currStats[OBJECT_RATK];
        }

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
        if (engaged.length) {
            var id;
            for(var i=0,l=engaged.length; i<l; i++){
                id = engaged[i];
                if (-1 === targets.indexOf(id)) validList.push(id);
            }
            targets = targets.concat(engaged);
        }else{
            if (-1 === targets.indexOf(engaged)) validList.push(engaged);
        }

        if (validList.length) appearance[HERO_ENEMIES] = targets.concat(validList);
    };
    me.isDead = function(){ return currStats[OBJECT_HP] < 1; };

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

        return me.drawMeshUI.call(this, ctx, {default: this.tileSet, spells: this.spellSet}, ent, com, comBox, scale, onCustomUI);
    };
});
