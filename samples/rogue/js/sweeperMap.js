pico.def('sweeperMap', 'picBase', function(){
    var
    me = this;

    // evt = {tileSet:tileSet, tileWidth:64, tileHeight:64, mapWidth:8, mapHeight:8, level:0, playerJob:game.PRIEST}
    me.init = function(elapsed, evt, entities){
        var
        map, mapWidth, mapHeight, heroPos,
        i, j, row;

        this.tileSet = evt.tileSet;
        this.heroJob = evt.heroJob;
        this.tileWidth = evt.tileWidth;
        this.tileHeight = evt.tileHeight;
        mapWidth = this.mapWidth = evt.mapWidth;
        mapHeight = this.mapHeight = evt.mapHeight;
        this.mapLevel = evt.mapLevel;

        map = this.map;
        for(i=0; i<mapHeight; i++){
            row = [];
            map.push(row);
            for(j=0; j<mapWidth; j++){
                row.push(G_FLOOR.UNCLEAR);
            }
        }

        heroPos = this.heroPos;
        heroPos[1] = i = Math.floor(Math.random()*mapHeight);
        heroPos[0] = j = Math.floor(Math.random()*mapWidth);
        map[i][j] = G_FLOOR.STAIR_UP;
        map[Math.floor(Math.random()*mapWidth)][Math.floor(Math.random()*mapHeight)] = G_FLOOR.STAIR_DOWN;

        return entities;
    };

    me.update = function(elapsed, evt, entities){
    };

    me.move = function(elapsed, evt, entities){
    };
});
