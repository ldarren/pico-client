pico.def('ai', function(){
    this.use('tome');

    var
    me = this,
    Floor = Math.floor, Ceil = Math.ceil, Random = Math.random, Round = Math.round,
    team = [],
    currIndex = 0,
    level = 0,
    god,hero,objects,flags,terrain,
    updateCreepStat = function(creep, level){
        var
        stat = me.getStatByCreepId(creep[OBJECT_ICON]).slice(),
        bufs = stat[CREEP_EFFECT],
        buf,i,l;

        for(i=CREEP_ATK; i<=CREEP_MDEF; i++){
            creep[i] = Ceil(stat[i]*level); // negative is allowed
        }

        for(i=0,l=bufs.length; i<l; i++){
            buf = bufs[i];
            if (!buf) continue;
            creep[CREEP_HP] += buf[OBJECT_HP];
            creep[CREEP_ATK] += buf[OBJECT_PATK]+buf[OBJECT_RATK];
            creep[CREEP_PDEF] += buf[OBJECT_DEF];
            creep[CREEP_MDEF] += buf[CHARMED_WILL];
        }

        return creep;
    },
    createCreepStat = function(creepId, level){
        var
        s = me.getStatByCreepId(creepId).slice(),
        templ = s[CREEP_EFFECT],
        effects = [],
        i, l;

        for(i=0,l=templ.length; i<l; i++){
            effects.push(createEffect(templ[i], level, -1));
        }

        effects.push(createEffect(G_EFFECT_TYPE.BURNED, level, -1));
        effects.push(createEffect(G_EFFECT_TYPE.CURSED, level, -1));
        effects.push(createEffect(G_EFFECT_TYPE.DISEASED, level, -1));
        effects.push(createEffect(G_EFFECT_TYPE.FEARED, level, -1));
        effects.push(createEffect(G_EFFECT_TYPE.FROZEN, level, -1));
        effects.push(createEffect(G_EFFECT_TYPE.POISONED, level, -1));
        effects.push(createEffect(G_EFFECT_TYPE.POISON_BLADE, level, 10));

        s[CREEP_EFFECT] = effects;
        s[OBJECT_NAME] = G_OBJECT_NAME[creepId];
        s[OBJECT_DESC] = G_OBJECT_DESC[creepId];
        s[OBJECT_LEVEL] = level;

        updateCreepStat(s, level);

        return s;
    },
    createEffect = function(type, level, period, icon){
        return me.tome.createEffect(type, level, period, icon);
    },
    updateEffect = function(creep, effect, steps){
        if (effect[EFFECT_PERIOD] < 0){
            // long live effect
            return true;
        }
        effect[EFFECT_PERIOD] -= steps;
        if (effect[EFFECT_PERIOD] > 0) return true;
        
        destroyEffect(creep, effect);
        return false;
    },
    destroyEffect = function(creep, effect){
    },
    pick = function(list, luck, grade){
        var
        luckMed = luck,
        luckHi = Round(luck/10),
        cap = 0,
        drop, select, i, l;

        for(i=0,l=list.length; i<l; i++){
            drop = list[i];
            if (grade & drop[DROP_GRADE]){
                cap += drop[DROP_RATE];
                switch(drop[DROP_QUALITY]){
                    case G_QUALITY.MEDIUM: cap += luckMed; break;
                    case G_QUALITY.HIGH: cap += luckHi; break;
                }
            }
        }

        select = Round(Random()*cap);

        cap = 0;
        for(i=0,l=list.length; i<l; i++){
            drop = list[i];
            if (grade & drop[DROP_GRADE]){
                cap += drop[DROP_RATE];
                switch(drop[DROP_QUALITY]){
                    case G_QUALITY.MEDIUM: cap += luckMed; break;
                    case G_QUALITY.HIGH: cap += luckHi; break;
                }
                if (cap >= select) return drop; 
            }
        }

        return drop;
    };

    me.init = function(){
        god = this.god;
        hero = this.hero;
        map = this.map;
        objects = this.objects;
        flags = this.flags;
        terrain = this.terrain;

        return objects;
    };

    me.exit = function(){
    };

    me.step = function(steps){
        var creep, bufs, remain, buf, b, bl;
        for(var i=0, l=objects.length; i<l; i++){
            creep = objects[i];
            if (!creep || G_OBJECT_TYPE.CREEP !== creep[OBJECT_TYPE]) continue;

            bufs = creep[CREEP_EFFECT];
            remain = [];
            for(b=0,bl=bufs.length; b<bl; b++){
                buf = bufs[b];
                if (!buf) continue;
                if (updateEffect(creep, buf, steps)) remain.push(buf);
            }
            if (bufs.length !== remain.length){
                creep[CREEP_EFFECT] = remain;
                updateCreepStat(creep, creep[OBJECT_LEVEL]);
            }
        }
    };

    me.changeTheme = function(){
        var
        keys = Object.keys(G_CREEP_TEAM),
        theme = keys[Floor(Random()*keys.length)],
        teamRaw = G_CREEP_TEAM[theme],
        shuffle = [],
        creepType, count, i, l;

        for(i=0, l=teamRaw.length; i<l; i+=2){
            creepType = teamRaw[i];
            count = teamRaw[i+1];

            while(count-- > 0){
                shuffle.push(creepType);
            }
        }

        team.length = 0;
        currIndex = 0;

        for (i=0, l=shuffle.length; i<l; i++){
            team.push(shuffle.splice(Floor(Random()*shuffle.length), 1)[0]);
        }
    };

    me.spawnCreep = function(level){
        if (currIndex >= team.length) currIndex = 0;
        return createCreepStat(team[currIndex++], level);
    };

    me.spawnChest = function(){
        return G_CREATE_OBJECT(G_ICON.CHEST);
    };

    me.spawnItem = function(itemId, gradeType, job, lvl, luck){
        var
        item = G_CREATE_OBJECT(itemId),
        itemName = item[OBJECT_NAME],
        itemType = item[OBJECT_TYPE],
        modifier, affix, stat, i, l, j, k, m;

        switch(itemType){
            case G_OBJECT_TYPE.WEAPON:
            case G_OBJECT_TYPE.ARMOR:
            case G_OBJECT_TYPE.JEWEL:
                switch(gradeType){
                    case G_GRADE.LEGENDARY:
                        modifier = pick(G_LEGENDARY, luck, gradeType);
                        affix = G_LEGENDARY_AFFIX[modifier[DROP_ID]];
                        itemName = affix[0] + ' ' + itemName + G_MSG.POSTFIX_SEPARATOR + affix[1];
                        for(i=DROP_GRADE+1, l=DROP_GRADE+3; i<l; i++){
                            stat = G_ENCHANTED_RATE[modifier[i]];
                            if (!(job & stat[ENCHANTED_CLASS])) continue;
                            item[OBJECT_FIRE] = stat[ENHANTED_FIRE];
                            item[OBJECT_AIR] = stat[ENHANTED_AIR];
                            item[OBJECT_WATER] = stat[ENHANTED_WATER];
                            item[OBJECT_EARTH] = stat[ENHANTED_EARTH];
                        }
                        for(i=DROP_GRADE+3, l=DROP_GRADE+5; i<l; i++){
                            stat = G_CHARMED_RATE[modifier[i]];
                            for(j=CHARMED_HP,k=CHARMED_DEMON,m=OBJECT_HP; j<=k; j++,m++){
                                item[m] += stat[j];
                            }
                        }
                        break;
                    case G_GRADE.ENCHANTED:
                        modifier = pick(G_ENCHANTED_RATE, luck, gradeType);
                        affix = G_ENCHANTED_PREFIX[modifier[DROP_ID]];
                        itemName = affix + ' ' + itemName;
                        if (job & modifier[ENCHANTED_CLASS]){
                            item[OBJECT_FIRE] = modifier[ENHANTED_FIRE];
                            item[OBJECT_AIR] = modifier[ENHANTED_AIR];
                            item[OBJECT_WATER] = modifier[ENHANTED_WATER];
                            item[OBJECT_EARTH] = modifier[ENHANTED_EARTH];
                        }
                        // fall through
                    case G_GRADE.CHARMED:
                        modifier = pick(G_CHARMED_RATE, luck, gradeType);
                        affix = G_CHARMED_POSTFIX[modifier[DROP_ID]];
                        itemName = itemName + G_MSG.POSTFIX_SEPARATOR + affix;
                        for(j=CHARMED_HP,k=CHARMED_DEMON,m=OBJECT_HP; j<=k; j++,m++){
                            item[m] += modifier[j];
                        }
                        break;
                }
                break;
        }
        
        item[OBJECT_NAME] = itemName;
        item[OBJECT_LEVEL] = lvl;
        item[OBJECT_GRADE] = gradeType;

        switch(itemType){
            case G_OBJECT_TYPE.WEAPON:
            case G_OBJECT_TYPE.ARMOR:
            case G_OBJECT_TYPE.JEWEL:
                for(i=OBJECT_HP+1,l=OBJECT_VEG; i<l; i++){
                    item[i] = Round(item[i]*lvl);
                }
                break;
        }
        return item;
    };

    me.openChest = function(job, luck, level){
        var
        capLvl = (G_MAP_PARAMS.length - 1)*5,
        minLvl = level < 4 ? 3 : level - 3,
        maxLvl = level > capLvl-4 ? capLvl : level + 3,
        lvl = minLvl + Round(Random()*(maxLvl - minLvl)),
        grade = pick(G_GRADE_RATE, luck, G_GRADE.ALL),
        gradeType = grade[DROP_ID],
        dropInfo = pick(G_ITEM_RATE, luck, gradeType),
        dropType = dropInfo[DROP_ID],
        itemRates = G_ITEM_SUB_RATE[dropType],
        itemRate = pick(itemRates, luck, gradeType);
        
        return me.spawnItem(itemRate[DROP_ID], gradeType, job, lvl, luck);
    };

    me.createGoods = function(npcType, goods){
        switch(npcType){
        case G_NPC_TYPE.ARCHMAGE:
            goods.push(G_CREATE_OBJECT(G_ICON.SMALL_HP));
            break;
        case G_NPC_TYPE.BLACKSMITH:
            goods.push(G_CREATE_OBJECT(G_ICON.SCIMITAR));
            break;
        }
        return goods;
    };

    me.getStatByTileId = function(id){ return me.getStatByObject(objects[id]); };
    me.getStatByObject = function(creep){ return me.getStatByCreepId(creep[0]); };
    me.getStatByCreepId = function(id){ return G_OBJECT[id]; };

    me.incrHp = function(id, inc){
        var creep = objects[id];

        if (!creep || G_OBJECT_TYPE.CREEP !== creep[OBJECT_TYPE]) return;
        var
        stat = me.getStatByObject(creep),
        creepHp = creep[CREEP_HP],
        statHp = stat[CREEP_HP];

        if (creepHp < 1) return;

        creepHp += inc;
        if (creepHp > statHp) creepHp = statHp;

        creep[CREEP_HP] = creepHp;
    };

    me.incrHpAll = function(inc){
        var creep, stat, creepHp, statHp;
        for(var i=0, l=objects.length; i<l; i++){
            creep = objects[i];
            if (!creep || G_OBJECT_TYPE.CREEP !== creep[OBJECT_TYPE]) continue;

            stat = me.getStatByObject(creep);
            creepHp = creep[CREEP_HP];
            statHp = stat[CREEP_HP];

            if (creepHp < 1) continue;

            creepHp += inc;
            if (creepHp > statHp) creepHp = statHp;
            creep[CREEP_HP] = creepHp;
        }
    };

    me.reveal = function(id){
        var object = objects[id];

        if (!object) return;

        if (map[id] & G_TILE_TYPE.HIDE){
            map[id] &= G_TILE_TYPE.SHOW;
            if (G_OBJECT_TYPE.CREEP === object[OBJECT_TYPE]) flags[id] = G_UI.FLAG;
            return;
        }else if (flags[id]){
            delete flags[id];
            hero.setEngaged(id);
            return;
        }
    };

    me.battle = function(){
        var
        targetIds = hero.getEngaged(),
        counterMsgs = [],
        def = hero.getDef(),
        hp = hero.getHp(),
        total, roll, atk, hit, targetId, target, creepName, counterMsg;

        for(var i=0,l=targetIds.length; i<l; i++){
            targetId = targetIds[i];
            target = objects[targetId];
            atk = target[CREEP_ATK];

            if (flags[targetId] || !atk || hp < 1){
                counterMsgs.push(null);
                continue;
            }

            creepName = target[OBJECT_NAME];
            roll = G_D20_ROLL();

            total = roll+atk;
            hit = total > def ? 1 : (0===roll ? 2:1);

            counterMsg = (hit ? G_MSG.COUNTER_WIN : G_MSG.COUNTER_LOST)
                .replace('NAME', creepName)
                .replace('TOTAL', total)
                .replace('ROLL', roll)
                .replace('ATK', atk)
                .replace('DEF', def)
                .replace('HP', hit);

            hp = hero.incrHp(-1*hit);

            if (hp < 1){
                counterMsg += G_MSG.HERO_KILL.replace('NAME', creepName);
            }
            counterMsgs.push(counterMsg);
        }

        return [targetIds, counterMsgs];
    };

    me.bury = function(id){
        var creep = objects[id];
        if (!creep || creep[CREEP_HP] > 0) return false;

        terrain[id] = G_FLOOR.BROKEN;

        if (creep[CREEP_ITEM]){
            creep = creep[CREEP_ITEM];
        }else{
            creep = G_CREATE_OBJECT(G_ICON.HEALTH_GLOBE);
        }
        hero.removeEngaged(id);
        delete flags[id];
        god.incrPiety(1);
        objects[id] = creep;

        return true;
    };
});
