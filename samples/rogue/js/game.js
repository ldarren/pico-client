pico.def('game', function(){

    var
    me = this,
    JOB_NAMES = ['Rogue', 'Priest', 'Barbarian', 'Druid', 'Hunter', 'Knight', 'Wizard', 'Warlock'];

    // evt = {tileSet:tileSet, tileWidth:64, tileHeight:64, mapWidth:8, mapHeight:8, level:0, playerJob:game.PRIEST}
    me.init = function(elapsed, evt, entities){
        var
        map, mapWidth, mapHeight, heroPos,
        i, j, row;

        me.tileSet = evt.tileSet;
        me.heroJob = evt.heroJob;
        me.tileWidth = evt.tileWidth;
        me.tileHeight = evt.tileHeight;
        mapWidth = me.mapWidth = evt.mapWidth;
        mapHeight = me.mapHeight = evt.mapHeight;
        me.mapLevel = evt.mapLevel;

        map = me.map = [];
        for(i=0; i<mapHeight; i++){
            row = [];
            map.push(row);
            for(j=0; j<mapWidth; j++){
                row.push(G_FLOOR.UNCLEAR);
            }
        }

        heroPos = me.heroPos = [];
        heroPos[1] = i = Math.floor(Math.random()*mapHeight);
        heroPos[0] = j = Math.floor(Math.random()*mapWidth);
        map[i][j] = G_FLOOR.STAIR_UP;
        map[Math.floor(Math.random()*mapWidth)][Math.floor(Math.random()*mapHeight)] = G_FLOOR.STAIR_DOWN;

        return entities;
    };

    me.update = function(elapsed, evt, entities){
    };

});
