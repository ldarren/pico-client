pico.def('hero', 'picUIContent', function(){
    var
    me = this,
    name = me.moduleName,
    Floor = Math.floor, Ceil = Math.ceil, Round = Math.round, Random = Math.random,
    objects, flags,
    position, selectedSpell, targetId,
    heroObj,
    appearance, stats, effects, bag, tome,
    currStats,
    d20Roll = function(){
        return Round(Random()*21);
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
            if (effects[id.split('effect')[1]]){
                return me.calcUIRect(rect, ui, tileScale);
            }
            return me.calcUIRect(rect, ui);
        }
    },
    onCustomDraw = function(ent, ctx, rect, ui, tss, tileScale){
        var
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
        case 'level':
            me.fillIconText(ctx, ts, ''+currStats[OBJECT_LEVEL], rect, tileScale);
            break;
        case 'str':
            me.fillIconText(ctx, ts, ''+currStats[OBJECT_MDEF], rect, tileScale);
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
            me.fillIconText(ctx, ts, 'Skull `'+G_UI.SKULL, rect, tileScale);
            break;
        case 'skull':
            me.fillIconText(ctx, ts, ''+currStats[HERO_SKULL], rect, tileScale);
            break;
        case 'patk':
            me.fillIconText(ctx, ts, ''+currStats[OBJECT_ATK], rect, tileScale);
            break;
        case 'ratk':
            me.fillIconText(ctx, ts, ''+currStats[OBJECT_RATK], rect, tileScale);
            break;
        case 'matk': // TODO: replace by will
            me.fillIconText(ctx, ts, ''+currStats[OBJECT_MATK], rect, tileScale);
            break;
        case 'pdef':
            me.fillIconText(ctx, ts, ''+currStats[OBJECT_DEF], rect, tileScale);
            break;
        case 'mdef': // TODO: replace by will
            me.fillIconText(ctx, ts, ''+currStats[OBJECT_MDEF], rect, tileScale);
            break;
        case 'helm':
            var item = appearance[HERO_HELM];
            if (item){
                ts.draw(ctx, item[0][OBJECT_ICON], rect[0], rect[1], rect[2], rect[3]);
            }
            break;
        case 'armor':
            break;
        case 'main':
            break;
        case 'off':
            break;
        case 'ringL':
            break;
        case 'ringR':
            break;
        case 'amulet':
            break;
        case 'quiver':
            break;
        default:
            var effect = effects[id.split('effect')[1]];
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
    },
    onCustomClick = function(ent, ui){
        console.log('click'+JSON.stringify(ui));
    },
    onCustomUI = function(){
        switch(Array.prototype.shift.call(arguments)){
        case me.CUSTOM_BOUND: return onCustomBound.apply(this, arguments); break;
        case me.CUSTOM_DRAW: return onCustomDraw.apply(this, arguments); break;
        case me.CUSTOM_CLICK: return onCustomClick.apply(this, arguments); break;
        }
    };

    me.create = function(ent, data){
        data = me.base.create.call(this, ent, data);

        data.font = this.smallDevice ? data.fontSmall : data.fontBig;
        return data;
    };

    me.init = function(){
        heroObj = this.mortal;
        if (!heroObj){
            heroObj = this.god.createHero();
        }
        objects = this.objects;
        flags = this.flags;
        appearance = heroObj.appearance;
        stats = heroObj.stats;
        effects = heroObj.effects;
        bag = heroObj.bag;
        tome = heroObj.tome;
        target = appearance[HERO_ENEMY];

        if (target){
            this.go('showInfo', {targetId: target, context:G_CONTEXT.WORLD});
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
            cooldown = spell[SPELL_COOLDOWN];
            if (cooldown) {
                cooldown -= steps;
                if (cooldown < 0) cooldown = 0;
            }
            spell[SPELL_COOLDOWN] = cooldown;
        }
    };

    me.battle = function(id, accident){
        me.setTargetId(id);

        var
        target = objects[id],
        flag = flags[id],
        creepName = target[OBJECT_NAME],
        attack = accident ? undefined : [d20Roll(), currStats[OBJECT_ATK], target[CREEP_DEF]],
        counter = flag || G_CREEP_TYPE.PLANT === target[OBJECT_SUB_TYPE] ? undefined : [d20Roll(), target[CREEP_ATK], currStats[OBJECT_DEF]],
        total, hit, attackMsg, counterMsg;

        if (attack){
            total = attack[0]+attack[1];
            hit = total > attack[2];

            attackMsg = (hit ? MSG_ATTACK_WIN : MSG_ATTACK_LOST)
            .replace('NAME', creepName)
            .replace('TOTAL', total)
            .replace('ROLL', attack[0])
            .replace('ATK', attack[1])
            .replace('DEF', attack[2])
            .replace('DMG', 1);

            if (hit) target[CREEP_HP]--;

            if (target[CREEP_HP] < 1){
                attackMsg += MSG_CREEP_KILL.replace('NAME', creepName);
            }
        }
        if (counter){
            total = counter[0]+counter[1];
            hit = total > counter[2];

            counterMsg = (hit ? MSG_COUNTER_WIN : MSG_COUNTER_LOST)
            .replace('NAME', creepName)
            .replace('TOTAL', total)
            .replace('ROLL', counter[0])
            .replace('ATK', counter[1])
            .replace('DEF', counter[2])
            .replace('HP', 1);

            if (hit) currStats[OBJECT_HP]--;

            if (currStats[OBJECT_HP] < 1){
                counterMsg += MSG_HERO_KILL.replace('NAME', creepName);
            }
        }

        delete flags[id];

        return [attackMsg, counterMsg];
    };

    me.flee = function(){
        if (!targetId) return false; // return error?

        var
        target = objects[targetId],
        roll = d20Roll(),
        total = roll + currStats[OBJECT_DEX];

        if (total > target[CREEP_ATK]) {
            me.setTargetId(undefined);
            return [true, MSG_FLEE_WIN
                .replace('TOTAL', total)
                .replace('ROLL', roll)
                .replace('DEX', currStats[OBJECT_DEX])
                .replace('NAME', target[OBJECT_NAME])
                .replace('ATK', target[CREEP_ATK])];
        }
        return [false, MSG_FLEE_LOST
                .replace('TOTAL', total)
                .replace('ROLL', roll)
                .replace('DEX', currStats[OBJECT_DEX])
                .replace('NAME', target[OBJECT_NAME])
                .replace('ATK', target[CREEP_ATK])
                .replace('HP', 1)];
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

        for (var i=0,l=HERO_QUIVER; i<=l; i++){
            slot = body[i];
            if (slot){
                recoverd = me.equipItem(slot);
                if (!recoverd) recovered = me.putIntoBag(slot[0]);
            }
            if (!recovered) return recovered;
        }
        slot = body[HERO_GOLD];
        if (slot) me.incrMoney(slot[0], slot[1]);
        slot = body[HERO_SKULL];
        if (slot) me.incrMoney(slot[0], slot[1]);
        if (body[HERO_BAG_CAP] > appearance[HERO_BAG_CAP]) appearance[HERO_BAG_CAP] = body[HERO_BAG_CAP];
        if (body[HERO_TOME_CAP] > appearance[HERO_TOME_CAP]) appearance[HERO_TOME_CAP] = body[HERO_TOME_CAP];
        return recovered;
    };

    me.incrMoney = function(money, count){
        switch(money[OBJECT_SUB_TYPE]){
            case G_MONEY_TYPE.GOLD: appearance[HERO_GOLD] += count; break;
            case G_MONEY_TYPE.SKULL: appearance[HERO_SKULL] += count; break;
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
                if (2 === item[WEAPON_HANDED]){
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
                switch(item[OBJECT_SUB_TYPE]){
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
                switch(item[OBJECT_SUB_TYPE]){
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

    me.unequipItem = function(type){
        var item = appearance[type];
        delete appearance[type];
        return item;
    };

    me.putIntoBag = function(item){
        var cap = me.getBagCap();
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
            default:
                var stack, stat;
                for(var i=0,l=bag.length; i<l; i++){
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
        if (cap <= bag.length) return false;
        bag.push([item, 1]);
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
        hero = this.hero,
        hp = hero.getPosition(),
        objects = this.objects,
        object = objects[id],
        objectType = object ? object[OBJECT_TYPE] : undefined,
        flags = this.flags;
                
        if (object && (G_OBJECT_TYPE.NPC === objectType || 
            G_OBJECT_TYPE.KEY === objectType || 
            G_OBJECT_TYPE.ENV === objectType)) return false;

        // some spell can only apply to hero
        switch(spell[OBJECT_SUB_TYPE]){
        case G_SPELL_TYPE.WHIRLWIND:
        case G_SPELL_TYPE.POISONS:
            if (hp !== id) return false;
        }

        // return true from here onwards
        spell[SPELL_COOLDOWN] = spell[SPELL_RELOAD]; // set cooldown;

        var
        castPt = d20Roll(),
        totalCastPt = castPt + currStats[OBJECT_MATK];

        if (0 === castPt){
            this.go('forgetSpell');
            this.go('showInfo', {info:'Spell major failure: You roll a 0, this spell was so powerfull for your feeble mind that it is thraumatized you. You are now scared and the spell is forgotten.'});
            return true; // spell cast
        }

        if (totalCastPt < spell[SPELL_DIFFICULTY]){
            this.go('showInfo', {info:'Spell minor failure: You have failed to cast this spell with a roll of '+totalCastPt+' ('+castPt+'+'+currStats[OBJECT_MATK]+') which is lower than the spell difficulty of '+spell[SPELL_DIFFICULTY]});
            return true; // spell cast
        }

        // deselect spell 
        selectedSpell = undefined;

        var
        targets = [],
        castStr = castPt + spell[SPELL_STRENGTH],
        nextAction, nextActionEvent, info;

        switch(spell[OBJECT_SUB_TYPE]){
        case G_SPELL_TYPE.WHIRLWIND:
            var
            touched = this.getAllTouched(id),
            contact, contactId, creepCount=0, chestCount=0;

            info = 'You rolled a '+castStr+' ('+castPt+'+'+spell[SPELL_STRENGTH]+')'; 
            for(var i=0,l=touched.length; i<l; i++){
                contactId = touched[i];
                contact = objects[contactId];
                if (!contact) continue;
                switch(contact[OBJECT_TYPE]){
                case G_OBJECT_TYPE.CREEP:
                    if (castStr > contact[CREEP_MDEF]){
                        contact[CREEP_HP]--;
                        this.ai.bury(contactId);
                        info += ', beats the def('+contact[CREEP_MDEF]+') of the '+contact[OBJECT_NAME]; 
                        targets.push(contactId);
                    }else{
                        info += ', failed to beat the def('+contact[CREEP_MDEF]+') of the '+contact[OBJECT_NAME]; 
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
                    delete objects[contatcId];
                    break;
                }
                map[contactId] &= G_TILE_TYPE.SHOW;
                delete flags[contactId];
            }
            if (chestCount) info += ', and you have destroyed '+chestCount+' chests'; 
            if (!creepCount && !chestCount) info += ', but noone is near you'; 
            nextAction = 'showInfo';
            nextActionEvent = { info:info };
            break;
        case G_SPELL_TYPE.POISONS:
            effects.push(spell);
            nextAction = 'showInfo';
            nextActionEvent = {info:'Your weapon has coated with poison'};
            break;
        case G_SPELL_TYPE.GAZE:
            if (!this.currentLevel) return false;
            if (!object){
                map[id] |= G_TILE_TYPE.CREEP;
                objects[id] = this.ai.spawnCreep(this.deepestLevel);
                this.recalHints();
                nextAction = 'attack';
                nextActionEvent = hero.battle(id, true);
            }else{
                flags[id] = G_UI.FLAG;
                nextAction = 'showInfo';
                nextActionEvent = { targetId: id, context: G_CONTEXT.WORLD };
            }
            map[id] &= G_TILE_TYPE.SHOW;
            break;
        case G_SPELL_TYPE.FIREBALL:
            if (object){
                switch(objectType){
                case G_OBJECT_TYPE.CREEP:
                    nextAction = 'showInfo';
                    object[CREEP_HP]--;
                    if (this.ai.bury(id)){
                        nextActionEvent = { info:'You have killed '+object[OBJECT_NAME] };
                    }else{
                        nextActionEvent = { info:'You have toasted '+object[OBJECT_NAME]+' but it is still alive' };
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
                        nextAction = 'showInfo';
                        nextActionEvent = { info:'You have toasted a '+object[OBJECT_NAME] };
                    }
                    break;
                default:
                    delete objects[id];
                    break;
                }
            }
            map[id] &= G_TILE_TYPE.SHOW;
            delete flags[id];
            break;
        }
        this.go('hideInfo');
        this.go('startEffect', {
            type:'castEfx',
            targets:[id],
            spells:[spell[OBJECT_ICON]],
            callback:'startEffect',
            event:{
                type:'damageEfx',
                targets:targets,
                callback:nextAction,
                event:nextActionEvent
                }
        });
        return true;
    };

    me.incrHp = function(inc) {
        var hp = currStats[OBJECT_HP];
        hp += inc;
        if (hp > stats[OBJECT_HP]) hp = stats[OBJECT_HP];
        currStats[OBJECT_HP] = hp;
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
    me.getLuck = function(){ return currStats[OBJECT_LUCK]; };
    me.getWill = function(){ return currStats[OBJECT_WILL]; };
    me.getBag = function(){ return bag; };
    me.getBagCap = function(){ return appearance[HERO_BAG_CAP]; };
    me.getItem = function(id){ return bag[id]; }
    me.getTome = function(){ return tome; };
    me.getTomeCap = function(){ return appearance[HERO_TOME_CAP]; };
    me.putIntoTome = function(spell){ return tome.push(spell); };
    me.equal = function(obj){ return obj[OBJECT_ICON] === currStats[OBJECT_ICON] && obj[OBJECT_TYPE] === currStats[OBJECT_TYPE]; };
    me.isTarget = function(id){ return targetId === id; };
    me.getTargetId = function(){ return targetId; };
    me.setTargetId = function(id){
        return appearance[HERO_ENEMY] = targetId = id;
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
