pico.def('ai', function(){
    var
    me = this,
    Floor = Math.floor, Ceil = Math.ceil, Random = Math.random,
    team = [],
    currIndex = 0,
    level = 0,
    objects,
    createCreepStat = function(creepId){
        var s = G_CREEP_STAT[creepId-G_CREEP.RAT].slice();
        for(var i=4; i<10; i++){
            s[i] = Ceil(s[i]*level);
        }
        return s;
    };

    me.init = function(){
        objects = this.objects;
        level = this.currentLevel;
        me.changeTheme(this.theme);

        return objects;
    };

    me.exit = function(){
    };

    me.step = function(){
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

    me.spawnCreep = function(){
        if (currIndex >= team.length) currIndex = 0;
        return createCreepStat(team[currIndex++], level);
    };

    me.spawnChest = function(){
        return [G_OBJECT.CHEST, G_OBJECT_TYPE.CHEST];
    };

    me.openChest = function(){
        return G_OBJECT.KEY_01;
    };

});
