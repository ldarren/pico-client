pico.def('ai', function(){
    var
    me = this,
    Floor = Math.floor, Ceil = Math.ceil, Random = Math.random,
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
        return [G_OBJECT.CHEST, G_OBJECT_TYPE.CHEST];
    };

    me.openChest = function(){
        return G_OBJECT.KEY_01;
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
        objects[id] = [G_OBJECT.HEALTH_GLOBE, G_OBJECT_TYPE.HEALTH];
        return true;
    };

});
