pico.def('sweeperMap', 'picBase', function(){
    var
    me = this,
    getTileHint = function(type){
        if (!type) return 0;
        return type & G_TILE_TYPE.CREEP ? 1 : type & G_TILE_TYPE.CHEST ? 10 : type & G_TILE_TYPE.STAIR_DOWN ? 100 : 0;
    };

    // evt = {tileSet:tileSet, tileWidth:64, tileHeight:64, mapWidth:8, mapHeight:8, level:0, playerJob:game.PRIEST}
    me.init = function(elapsed, evt, entities){
        this.tileSet = evt.tileSet;
        this.heroJob = evt.heroJob;
        this.tileWidth = evt.tileWidth;
        this.tileHeight = evt.tileHeight;
        this.mapLevel = evt.mapLevel;
        this.mapWidth = evt.mapWidth;
        this.mapHeight = evt.mapHeight;

        var
        shuffle = [],
        map = this.map,
        mapW = this.mapWidth, mapH = this.mapHeight,
        hints = this.hints,
        objects = this.objects,
        flags = this.flags,
        i, l, c;

        map.length = 0;
        hints.length = 0;
        objects.length = 0;
        flags.length = 0;

        for(i=0, l=mapW*mapH; i<l; i++){
            map.push(G_TILE_TYPE.HIDE);
            hints.push(9); // default is invalid count
            shuffle.push(i);
        }

        // add creeps
        for(i=0,l=((this.mapLevel * 10) + 1); i<l; i++){
            c = shuffle.splice(Math.floor(Math.random()*shuffle.length), 1)[0];
            map[c] |= G_TILE_TYPE.CREEP;
            objects[c] = G_CREEP.WOLF;
        }

        // add chests
        for(i=0,l=((this.mapLevel * 3) + 1); i<l; i++){
            c = shuffle.splice(Math.floor(Math.random()*shuffle.length), 1)[0];
            map[c] |= G_TILE_TYPE.CHEST;
            objects[c] = G_OBJECT.CHEST_CLOSED;
        }

        c = shuffle.splice(Math.floor(Math.random()*shuffle.length), 1)[0];
        map[c] = G_TILE_TYPE.SHOW | G_TILE_TYPE.STAIR_UP;
        objects[c] = G_FLOOR.START_UP;
        this.heroPos = c;

        c = shuffle.splice(Math.floor(Math.random()*shuffle.length), 1)[0];
        map[c] |= G_TILE_TYPE.STAIR_DOWN;
        objects[c] = G_FLOOR.START_DOWN;

        for(i=0,l=mapW+mapH; i<l; i++){
            if (map[i] > G_TILE_TYPE.HIDE) continue;
            hints[i] = 
                getTileHint(map[i-1]) +
                getTileHint(map[i+1]) +
                getTileHint(map[i-mapW]) +
                getTileHint(map[i-mapW+1]) +
                getTileHint(map[i-mapW-1]) +
                getTileHint(map[i+mapW]) +
                getTileHint(map[i+mapW-1]) +
                getTileHint(map[i+mapW+1])
        }

        return entities;
    };

    me.update = function(elapsed, evt, entities){
    };

    me.explore = function(elapsed, evt, entities){
        alert(evt);
    };
});
