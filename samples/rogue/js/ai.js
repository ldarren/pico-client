var god = require('god');
var hero = require('hero');
var tome = require('tome');

var
Floor = Math.floor, Ceil = Math.ceil, Random = Math.random, Round = Math.round,
team = [],
currIndex = 0,
level = 0,
map,objects,flags,terrain,
updateCreepStat = function(creep, level){
    var
    stat = me.getStatByCreepId(creep[OBJECT_ICON]).slice(),
    bufs = creep[CREEP_TRAITS],
    buf,i,l;

    for(i=CREEP_ATK; i<=CREEP_MDEF; i++){
        creep[i] = Ceil(stat[i]*level); // negative is allowed
    }

    for(i=0,l=bufs.length; i<l; i++){
        buf = bufs[i];
        if (!buf) continue;
        creep[CREEP_HP] += buf[CREEP_HP];
        creep[CREEP_ATK] += buf[CREEP_ATK];
        creep[CREEP_PDEF] += buf[CREEP_PDEF];
        creep[CREEP_MDEF] += buf[CREEP_MDEF];
    }

    return creep;
},
createCreepStat = function(creepId, level){
    var
    s = me.getStatByCreepId(creepId).slice(),
    templ = s[CREEP_TRAITS] || [],
    effects = [],
    trait,
    i, l;

    for(i=0,l=templ.length; i<l; i++){
        effects.push(G_CREATE_OBJECT(templ[i]));
    }
    for(i=CREEP_ON_REVEAL; i<CREEP_TRAITS; i++){
        trait = s[i];
        if (trait) effects.push(G_CREATE_OBJECT(trait));
    }

    s[CREEP_TRAITS] = effects;
    s[OBJECT_NAME] = G_OBJECT_NAME[creepId];
    s[OBJECT_DESC] = G_OBJECT_DESC[creepId];
    s[OBJECT_LEVEL] = level;

    updateCreepStat(s, level);

    return s;
},
enchantItem = function(item, modifier){
    item[OBJECT_FIRE] += modifier[ENCHANTED_FIRE];
    item[OBJECT_AIR] += modifier[ENCHANTED_AIR];
    item[OBJECT_WATER] += modifier[ENCHANTED_WATER];
    item[OBJECT_EARTH] += modifier[ENCHANTED_EARTH];

    var stat = G_CHARMED_RATE[modifier[ENCHANTED_CHARM]];
    charmItem(item, stat);
},
charmItem = function(item, modifier){
    for(var j=CHARMED_HP,k=CHARMED_DEMON,m=OBJECT_HP; j<=k; j++,m++){
        item[m] += modifier[j];
    }
},
createEffect = function(type, level, period, icon){
    return tome.createEffect(type, level, period, icon);
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
    map = this.map;
    objects = this.objects;
    flags = this.flags;
    terrain = this.terrain;

    return objects;
};

me.exit = function(){
    return this.objects;
};

me.step = function(steps){
    var creep, bufs, remain, buf, b, bl;
    for(var i=0, l=objects.length; i<l; i++){
        creep = objects[i];
        if (!creep || G_OBJECT_TYPE.CREEP !== creep[OBJECT_TYPE]) continue;

        bufs = creep[CREEP_TRAITS];
        remain = [];
        for(b=0,bl=bufs.length; b<bl; b++){
            buf = bufs[b];
            if (!buf) continue;
            if (updateEffect(creep, buf, steps)) remain.push(buf);
        }
        if (bufs.length !== remain.length){
            creep[CREEP_TRAITS] = remain;
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

me.spawnItemByType = function(itemRates, gradeType, luck, lvl){
    var
    itemRate = pick(itemRates, luck, gradeType),
    modifier;

    switch(gradeType){
    case G_GRADE.LEGENDARY: modifier = pick(G_LEGENDARY_RATE, luck, gradeType); break; 
    case G_GRADE.ENCHANTED: modifier = pick(G_ENCHANTED_RATE, luck, gradeType); break; 
    case G_GRADE.CHARMED: modifier = pick(G_CHARMED_RATE, luck, gradeType); break; 
    }

    return me.spawnItem(itemRate[OBJECT_ICON], modifier, gradeType, lvl);
};

me.spawnItem = function(itemId, modifier, gradeType, lvl){
    var
    item = G_CREATE_OBJECT(itemId),
    itemName = item[OBJECT_NAME],
    itemType = item[OBJECT_TYPE],
    capLvl = G_MAP_PARAMS.length - 1,
    affix, stat, i, l;

    lvl = (lvl < 1 ? 1 : (lvl > capLvl ? capLvl : lvl));

    switch(itemType){
    case G_OBJECT_TYPE.WEAPON:
    case G_OBJECT_TYPE.ARMOR:
    case G_OBJECT_TYPE.JEWEL:
        switch(gradeType){
        case G_GRADE.LEGENDARY:
            affix = G_LEGENDARY_AFFIX[modifier[DROP_ID]];
            itemName = affix[0] + ' ' + itemName + G_MSG.POSTFIX_SEPARATOR + affix[1];
            for(i=DROP_GRADE+1, l=DROP_GRADE+3; i<l; i++){
                stat = G_ENCHANTED_RATE[modifier[i]];
                enchantItem(item, stat);
            }
            break;
        case G_GRADE.ENCHANTED:
            affix = G_ENCHANTED_PREFIX[modifier[DROP_ID]];
            itemName = affix + ' ' + itemName;
            enchantItem(item, modifier);
            break;
        case G_GRADE.CHARMED:
            affix = G_CHARMED_POSTFIX[modifier[DROP_ID]];
            itemName = itemName + G_MSG.POSTFIX_SEPARATOR + affix;
            charmItem(item, modifier);
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
        for(i=OBJECT_WILL,l=OBJECT_VEG; i<l; i++){
            item[i] = Round(item[i]*lvl);
        }
        break;
    }
    return item;
};

me.openChest = function(luck, level){
    var
    capLvl = (G_MAP_PARAMS.length - 1)*5,
    minLvl = level - 3,
    maxLvl = level + 3,
    lvl = minLvl + Round(Random()*(maxLvl - minLvl)),
    grade = pick(G_GRADE_RATE, luck, G_GRADE.ALL),
    gradeType = grade[DROP_ID],
    dropInfo = pick(G_ITEM_RATE, luck, gradeType),
    dropType = dropInfo[DROP_ID],
    itemRates = G_ITEM_SUB_RATE[dropType],
    itemRate = pick(itemRates, luck, gradeType),
    modifier;

    switch(gradeType){
    case G_GRADE.LEGENDARY: modifier = pick(G_LEGENDARY_RATE, luck, gradeType); break; 
    case G_GRADE.ENCHANTED: modifier = pick(G_ENCHANTED_RATE, luck, gradeType); break; 
    case G_GRADE.CHARMED: modifier = pick(G_CHARMED_RATE, luck, gradeType); break; 
    }
    
    return me.spawnItem(itemRate[DROP_ID], modifier, gradeType, lvl);
};

me.gamble = function(itemId, luck, level){
    var
    grade = pick(G_GRADE_RATE, luck, G_GRADE.ALL),
    gradeType = grade[DROP_ID],
    modifier;

    switch(gradeType){
    case G_GRADE.LEGENDARY: modifier = pick(G_LEGENDARY_RATE, luck, gradeType); break; 
    case G_GRADE.ENCHANTED: modifier = pick(G_ENCHANTED_RATE, luck, gradeType); break; 
    case G_GRADE.CHARMED: modifier = pick(G_CHARMED_RATE, luck, gradeType); break; 
    }
    
    return me.spawnItem(itemId, modifier, gradeType, level);
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
    map[id] &= G_TILE_TYPE.SHOW;
    delete flags[id];

    var obj = objects[id];
    if (!obj) return;

    switch(obj[OBJECT_TYPE]){
    case G_OBJECT_TYPE.CREEP:
        hero.setEngaged(id);
        break;
    case G_OBJECT_TYPE.CHEST:
        if (G_CHEST_TYPE.CHEST === obj[OBJECT_SUB_TYPE]){
            objects[objId] = G_CREATE_OBJECT(G_ICON.CHEST_EMPTY);
        }
        break;
    }
};

me.attack = function(){
    var
    targetIds = hero.getEngaged(),
    creepIds = [],
    targets = [],
    def = hero.getDef(),
    pos = hero.getPosition(),
    hp = hero.getHp(),
    atk, targetId, target;

    for(var i=0,l=targetIds.length; i<l; i++){
        targetId = targetIds[i];
        target = objects[targetId];
        atk = target[CREEP_ATK];

        if (flags[targetId] || !atk || hp < 1){
            continue;
        }

        if (atk > def) {
            hp = hero.incrHp(-1);
            creepIds.push(targetId);
            targets.push([pos, OBJECT_HP, -1]);
        }
        hero.defend(targetId);
    }

    return [creepIds, targets];
};

me.defend = function(id){
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
