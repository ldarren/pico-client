pico.def('ai', function(){
    var
    me = this,
    Floor = Math.floor, Ceil = Math.ceil, Random = Math.random, Round = Math.round,
    team = [],
    currIndex = 0,
    level = 0,
    objects,
    terrain,
    createCreepStat = function(creepId, level){
        var s = me.getStatByCreepId(creepId).slice();
        for(var i=CREEP_ATK; i<=CREEP_MDEF; i++){
            s[i] = Ceil(s[i]*level); // negative is allowed
        }
        s[OBJECT_NAME] = G_OBJECT_NAME[s[OBJECT_ICON]];
        s[OBJECT_LEVEL] = level;
        return s;
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
        objects = this.objects;
        terrain = this.terrain;
        me.changeTheme();

        return objects;
    };

    me.exit = function(){
    };

    me.step = function(steps){
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
        var c = G_OBJECT[G_ICON.CHEST].slice();
        c[OBJECT_NAME] = G_OBJECT_NAME[c[OBJECT_ICON]];
        return c;
    };

    me.createGoods = function(npcType, goods){
        var item;

        switch(npcType){
            case G_NPC_TYPE.ARCHMAGE:
                item = G_OBJECT[G_ICON.SMALL_HP].slice();
                item[OBJECT_NAME] = G_OBJECT_NAME[item[OBJECT_ICON]];
                goods.push(item);
                break;
            case G_NPC_TYPE.BLACKSMITH:
                item = G_OBJECT[G_ICON.SCIMITAR].slice();
                item[OBJECT_NAME] = G_OBJECT_NAME[item[OBJECT_ICON]];
                goods.push(item);
                break;
        }
        return goods;
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
        itemRate = pick(itemRates, luck, gradeType),
        item = G_OBJECT[itemRate[DROP_ID]].slice(),
        itemName = G_OBJECT_NAME[item[OBJECT_ICON]],
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
                        itemName = affix[0] + ' ' + itemName + POSTFIX_SEPARATOR + affix[1];
                        for(i=DROP_GRADE+1, l=DROP_GRADE+3; i<l; i++){
                            stat = G_ENCHANTED_RATE[modifier[i]];
                            if (!(job & stat[ENCHANTED_CLASS])) continue;
                            item[OBJECT_SPELLS].push(stat[ENCHANTED_SPELL]);
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
                            item[OBJECT_SPELLS].push(modifier[ENCHANTED_SPELL]);
                        }
                        // fall through
                    case G_GRADE.CHARMED:
                        modifier = pick(G_CHARMED_RATE, luck, gradeType);
                        affix = G_CHARMED_POSTFIX[modifier[DROP_ID]];
                        itemName = itemName + POSTFIX_SEPARATOR + affix;
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

    me.studyScroll = function(){
        var spell = G_OBJECT[187].slice();
        spell[OBJECT_NAME] = G_OBJECT_NAME[spell[OBJECT_ICON]];
        return spell;
    };

    me.getStatByTileId = function(id){ return me.getStatByObject(objects[id]); };
    me.getStatByObject = function(creep){ return me.getStatByCreepId(creep[0]); };
    me.getStatByCreepId = function(id){ return G_OBJECT[id]; };

    me.incrHp = function(id, inc){
        var creep = objects[id];

        if (!creep || G_OBJECT_TYPE.CREEP !== creep[OBJECT_ICON]) return;
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
        var creep, stati, creepHp, statHp;
        for(var i=0, l=objects.length; i<l; i++){
            creep = objects[i];
            if (!creep || G_OBJECT_TYPE.CREEP !== creep[OBJECT_ICON]) continue;

            stat = me.getStatByObject(creep);
            creepHp = creep[CREEP_HP];
            statHp = stat[CREEP_HP];

            if (creepHp < 1) continue;

            creepHp += inc;
            if (creepHp > statHp) creepHp = statHp;
            creep[CREEP_HP] = creepHp;
        }
    };

    me.bury = function(id){
        var creep = objects[id];
        if (!creep || creep[CREEP_HP] > 0) return false;

        terrain[id] = G_FLOOR.BROKEN;

        if (creep[CREEP_ITEM]){
            creep = creep[CREEP_ITEM];
        }else{
            creep = G_OBJECT[G_ICON.HEALTH_GLOBE].slice();
            creep[OBJECT_NAME] = G_OBJECT_NAME[G_ICON.HEALTH_GLOBE];
        }
        objects[id] = creep;

        return true;
    };

});
