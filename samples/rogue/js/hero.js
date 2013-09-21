pico.def('hero', 'picUIWindow', function(){
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
    drawSmall = function(ctx, win, com, rect){
        var
        ts = this.tileSet,
        tw = this.tileWidth,
        th = this.tileHeight,
        sd = this.smallDevice,
        gs = win.gridSize,
        margin = sd ? 2 : 4,
        pw = (rect.width - gs*2 - margin*2)/3,
        textWidth3 = sd ? 15 : 30,
        textWidth2 = sd ? 20 : 50,
        X = rect.x + gs + margin,
        Y = rect.y + margin,
        x = X, y = Y,
        uiSize = sd ? 16 : 32,
        i, l;

        ctx.save();
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.font = com.font;
        ctx.fillStyle = com.fontColor;

        ctx.fillText(currStats[OBJECT_NAME], x, y + uiSize/2, rect.width);

        x = X;
        y += uiSize;
        uiSize = sd ? 16 : 32;

        x = me.drawData(ctx, ts, G_UI.LEVEL, currStats[OBJECT_LEVEL], x, y, uiSize, margin, textWidth3);
        x = me.drawData(ctx, ts, G_UI.DEX, currStats[OBJECT_DEX], x, y, uiSize, margin, textWidth3);
        x = me.drawData(ctx, ts, G_UI.LUCK, currStats[OBJECT_LUCK], x, y, uiSize, margin, textWidth3);

        x = X + pw;
        y = Y;
        uiSize = sd ? 8 : 16;
        
        // draw hp
        for(i=0, l=stats[OBJECT_HP]; i<l; i++){
            ts.draw(ctx, (i < currStats[OBJECT_HP]) ? G_UI.HP : G_UI.HP_EMPTY, x, y+margin, uiSize, uiSize);
            x += uiSize;
        }

        x = X + pw;
        uiSize = sd ? 16 : 32;
        y += uiSize;

        x = me.drawData(ctx, ts, G_UI.GOLD, appearance[HERO_GOLD], x, y, uiSize, margin, textWidth2);
        x = me.drawData(ctx, ts, G_UI.SKULL, appearance[HERO_SKULL], x, y, uiSize, margin, textWidth2);

        x = X + pw*2;
        y = Y;
        
        x = me.drawData(ctx, ts, G_UI.PATK, currStats[OBJECT_ATK], x, y, uiSize, margin, textWidth3);
        x = me.drawData(ctx, ts, G_UI.RATK, currStats[OBJECT_RATK], x, y, uiSize, margin, textWidth3);
        x = me.drawData(ctx, ts, G_UI.MATK, currStats[OBJECT_MATK], x, y, uiSize, margin, textWidth3);

        x = X + pw*2;
        y += uiSize;

        x = me.drawData(ctx, ts, G_UI.PDEF, currStats[OBJECT_DEF], x, y, uiSize, margin, textWidth3);
        x = me.drawData(ctx, ts, G_UI.MDEF, currStats[OBJECT_MDEF], x, y, uiSize, margin, textWidth3);
        x = me.drawData(ctx, ts, G_UI.WILL, currStats[OBJECT_WILL], x, y, uiSize, margin, textWidth3);

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
        ts.draw(ctx, currStats[OBJECT_ICON], x, y, tw, th);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.font = com.font;
        ctx.fillStyle = com.fontColor;
        ctx.fillText(currStats[OBJECT_NAME], x + tw/2, y + th, rect.width);
        ctx.restore();
    };

    me.create = function(ent, data){
        data.font = this.smallDevice ? data.fontSmall : data.fontBig;
        return data;
    };

    me.init = function(){
        heroObj = this.mortal;
        if (!heroObj){
            heroObj = this.god.createHero('Sir John Fenwick of Wallington');
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
        var id = HERO_GOLD;
        switch(money[OBJECT_SUB_TYPE]){
            case G_MONEY_TYPE.GOLD: id = HERO_GOLD; break;
            case G_MONEY_TYPE.SKULL: id = HERO_SKULL; break;
            default: return false;
        }

        if (appearance[id]){
            appearance[id][1] += count;
        }else{
            appearance[id] = [money, count];
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
                break;
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

    me.draw = function(ctx, ent, clip){
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
