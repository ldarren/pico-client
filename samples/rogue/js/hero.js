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
    onDrawMeshUICustom = function(ctx, rect, ui){
        var
        ts = this.tileSet,
        sd = this.smallDevice,
        id = ui.userData.id,
        labelOpt = {align:3},
        valueOpt = {align:1};
        if ('custom1Label' === id) id = 'goldLabel';
        else if ('custom2Label' === id) id = 'skullLabel';
        else if ('custom1' === id) id = 'gold';
        else if ('custom2' === id) id = 'skull';
        switch(id){
        case 'name':
            me.fillIconText(ctx, ts, currStats[OBJECT_NAME], rect[0], rect[1], rect[2], rect[3]);
            break;
        case 'level':
            me.fillIconText(ctx, ts, ''+currStats[OBJECT_LEVEL], rect[0], rect[1], rect[2], rect[3], valueOpt);
            break;
        case 'str':
            me.fillIconText(ctx, ts, ''+currStats[OBJECT_MDEF], rect[0], rect[1], rect[2], rect[3]);
            break;
        case 'dex':
            me.fillIconText(ctx, ts, ''+currStats[OBJECT_DEX], rect[0], rect[1], rect[2], rect[3]);
            break;
        case 'luck':
            me.fillIconText(ctx, ts, ''+currStats[OBJECT_LUCK], rect[0], rect[1], rect[2], rect[3]);
            break;
        case 'will':
            me.fillIconText(ctx, ts, ''+currStats[OBJECT_WILL], rect[0], rect[1], rect[2], rect[3]);
            break;
        case 'hp':
            // draw hp
            var iconText='HP:';
            for(var i=0, l=stats[OBJECT_HP]; i<l; i++){
                iconText += ' `'+((i < currStats[OBJECT_HP]) ? G_UI.HP : G_UI.HP_EMPTY);
            }
            me.fillIconText(ctx, ts, iconText, rect[0], rect[1], rect[2], rect[3]);
            break;
        case 'goldLabel':
            me.fillIconText(ctx, ts, 'Gold `'+G_UI.GOLD, rect[0], rect[1], rect[2], rect[3], labelOpt);
            break;
        case 'gold':
            me.fillIconText(ctx, ts, ''+currStats[HERO_GOLD], rect[0], rect[1], rect[2], rect[3], valueOpt);
            break;
        case 'skullLabel':
            me.fillIconText(ctx, ts, 'Skull `'+G_UI.SKULL, rect[0], rect[1], rect[2], rect[3], labelOpt);
            break;
        case 'skull':
            me.fillIconText(ctx, ts, ''+currStats[HERO_SKULL], rect[0], rect[1], rect[2], rect[3], valueOpt);
            break;
        case 'patk':
            me.fillIconText(ctx, ts, '`'+G_UI.PATK+' Melee: '+currStats[OBJECT_ATK], rect[0], rect[1], rect[2], rect[3]);
            break;
        case 'ratk':
            me.fillIconText(ctx, ts, '`'+G_UI.RATK+' Range: '+currStats[OBJECT_RATK], rect[0], rect[1], rect[2], rect[3]);
            break;
        case 'matk':
            me.fillIconText(ctx, ts, '`'+G_UI.MATK+' Magic: '+currStats[OBJECT_MATK], rect[0], rect[1], rect[2], rect[3]);
            break;
        case 'pdef':
            me.fillIconText(ctx, ts, ''+currStats[OBJECT_DEF], rect[0], rect[1], rect[2], rect[3]);
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
            break;
        }
    },
    onClickMeshUI = function(ctx, rect, ui){
        console.log('click'+JSON.stringify(ui));
    };

    me.create = function(ent, data){
        data.font = this.smallDevice ? data.fontSmall : data.fontBig;
        data.layout = [];
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

        me.unslot('draw', this, onDrawMeshUICustom);
        me.unslot('click', this, onClickMeshUI);
        me.slot('draw', this, onDrawMeshUICustom);
        me.slot('click', this, onClickMeshUI);

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
    }

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
        currStats = stats.slice();
        for(var i=OBJECT_WILL; i<OBJECT_VEG; i++){
            currStats[i] = Ceil(currStats[i]*lvl); // negative is ok
        }
        currStats[OBJECT_LEVEL] = lvl;
        return currStats;
    };

    me.castSpell = function(){
        var s = selectedSpell;
        if (!s || s[SPELL_COOLDOWN]) return;

        selectedSpell = undefined;
        s[SPELL_COOLDOWN] = s[SPELL_RELOAD]; // set cooldown;

        return s; // TODO return spell effects instead
    };

    me.selectSpell = function(spell){
        if (spell && spell[SPELL_COOLDOWN]) return;
        selectedSpell = spell;
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
        comBox = ent.getComponent(com.box);

        if (me.clickMeshUI(x, y, state, comBox, com.layout)) return true;
        return false;
    };

    me.draw = function(ctx, ent, clip){
        var
        com = ent.getComponent(name),
        win = ent.getComponent(com.win),
        rect = ent.getComponent(com.box),
        scale = this.smallDevice ? 1 : 2;

        return me.drawMeshUI(ctx, rect, com.layout, {main: this.tileSet}, scale, com.font);
    };
});
