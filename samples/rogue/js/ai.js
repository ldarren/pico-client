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
        for(var i=4; i<10; i++){
            s[i] = Ceil(s[i]*level);
        }
        return s;
    },
    pick = function(list, luck, grade){
        var
        luckMed = luck,
        luckHi = Round(luck/10),
        cap = 0,
        unit, select, i, l;

        for(i=0,l=list.length; i<l; i++){
            unit = list[i];
            if (grade & unit[3]){
                cap += unit[1];
                switch(unit[2]){
                    case G_QUALITY.MEDIUM: cap += luckMed; break;
                    case G_QUALITY.HIGH: cap += luckHi; break;
                }
            }
        }

        select = Round(Random()*cap);

        cap = 0;
        for(i=0,l=list.length; i<l; i++){
            unit = list[i];
            if (grade & unit[3]){
                cap += unit[1];
                switch(unit[2]){
                    case G_QUALITY.MEDIUM: cap += luckMed; break;
                    case G_QUALITY.HIGH: cap += luckHi; break;
                }
                if (cap >= select) return unit; 
            }
        }

        return unit;
    };

    me.init = function(){
        objects = this.objects;
        terrain = this.terrain;
        me.changeTheme(this.theme);

        return objects;
    };

    me.exit = function(){
    };

    me.step = function(steps){
    };

    me.changeTheme = function(theme){
        var
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
        return [G_ICON.CHEST, G_OBJECT_TYPE.CHEST];
    };

    me.openChest = function(luck, level){
        var
        minLvl = level < 4 ? 3 : level - 3,
        maxLvl = level > 256 ? 260 : level + 3,
        lvl = minLvl + Round(Random()*(maxLvl - minLvl)),
        grade = pick(G_GRADE_RATE, luck, G_GRADE.ALL),
        gradeType = grade[0],
        itemTypeInfo = pick(G_ITEM_RATE, luck, gradeType),
        itemType = itemTypeInfo[0],
        itemRates = G_ITEM_SUB_RATE[itemType],
        itemRate = pick(itemRates, luck, gradeType),
        item = G_OBJECT[itemRate[0]],
        itemName = G_OBJECT_NAME[item[0]],
        modifier, affix;

        // there's no common jewel :p
        if (G_OBJECT_TYPE.JEWEL === itemType && G_GRADE.COMMON === gradeType) gradeType = G_GRADE.CHARMED;

        switch(itemType){
            case G_OBJECT_TYPE.WEAPON:
            case G_OBJECT_TYPE.ARMOR:
            case G_OBJECT_TYPE.JEWEL:
                switch(gradeType){
                    case G_GRADE.LEGENDARY:
                        modifier = pick(G_LEGENDARY, luck, gradeType);
                        affix = G_LEGENDARY_AFFIX[modifier[0]];
                        itemName = affix[0] + ' ' + itemName + ' of ' + affix[1];
                        break;
                    case G_GRADE.ENCHANTED:
                        modifier = pick(G_ENCHANTED, luck, gradeType);
                        affix = G_ENCHANTED_PREFIX[modifier[0]];
                        itemName = affix + ' ' + itemName;
                        // fall through
                    case G_GRADE.CHARMED:
                        modifier = pick(G_CHARMED, luck, gradeType);
                        affix = G_CHARMED_POSTFIX[modifier[0]];
                        itemName = itemName + ' of ' + affix;
                        break;
                }
                break;
        }

        return item;
    };

    me.getStatByTileId = function(id){ return me.getStatByObject(objects[id]); };
    me.getStatByObject = function(creep){ return me.getStatByCreepId(creep[0]); };
    me.getStatByCreepId = function(id){ return G_CREEP_STAT[id-G_ICON.RAT]; };

    me.incrHp = function(id, inc){
        var creep = objects[id];

        if (!creep || creep[3] > 0) return;
        var stat = me.getStatByObject(creep);
        creep[3] += inc;
        if (creep[3] > stat[3]) creep[3] = stat[3];
    };

    me.incrHpAll = function(inc){
        var creep, stat;
        for(var i=0, l=objects.length; i<l; i++){
            creep = objects[i];
            if (!creep || creep[1] !== G_OBJECT_TYPE.CREEP) continue;
            stat = me.getStatByObject(creep);
            creep[3] += inc;
            if (creep[3] > stat[3]) creep[3] = stat[3];
        }
    };

    me.bury = function(id){
        var creep = objects[id];
        if (!creep || creep[3] > 0) return false;

        terrain[id] = G_FLOOR.BROKEN;
        objects[id] = [G_ICON.HEALTH_GLOBE, G_OBJECT_TYPE.HEALTH];
        return true;
    };

});
