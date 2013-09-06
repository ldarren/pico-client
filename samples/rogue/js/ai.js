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
    pick = function(list, luck){
        var
        luckMed = luck,
        luckHi = Round(luck/10),
        cap = 0,
        unit, select, i, l;

        for(i=0,l=list.length; i<l; i++){
            unit = list[i];
            cap += unit[1];
            switch(unit[2]){
                case G_QUALITY.MEDIUM:
                    cap += luckMed;
                    break;
                case G_QUALITY.HIGH:
                    cap += luckHi;
                    break;
            }
        }

        select = Round(Random()*cap);

        cap = 0;
        for(i=0,l=list.length; i<l; i++){
            unit = list[i];
            cap += unit[1];
            switch(unit[2]){
                case G_QUALITY.MEDIUM:
                    cap += luckMed;
                    break;
                case G_QUALITY.HIGH:
                    cap += luckHi;
                    break;
            }
            if (cap >= select) return unit; 
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
        itemType = pick(G_ITEM_RATE, luck),
        items = G_ITEM_TYPE[itemType[0]],
        gradeType = pick(G_GRADE_RATE, luck);

        switch(gradeType[0]){
            case G_GRADE.COMMON:
                break;
        }

        return pick(items, luck);
    };

    me.getStatByTileId = function(id){ return me.getStatByObject(objects[id]); };
    me.getStatByObject = function(creep){ return me.getStatByCreepId(creep[0]); };
    me.getStatByCreepId = function(id){ return G_CREEP_STAT[id-G_CREEP.RAT]; };

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
