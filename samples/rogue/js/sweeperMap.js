pico.def('sweeperMap', 'picBase', function(){
    var
    me = this,
    name = me.moduleName,
    getTileHint = function(hint, type){
        if (type & G_TILE_TYPE.OBSTACLES){
            hint |= type;
            hint += 0x10;
        }
        return hint;
    },
    fill = function(map, hints, width, i){
        var count = 0;
        if (undefined === map[i] || !(map[i] & G_TILE_TYPE.HIDE)) return count;
        map[i] &= G_TILE_TYPE.SHOW;
        count = 1;
        if (0 === hints[i]){
            count += fill(map, hints, width, i - width);
            count += fill(map, hints, width, i + width);
            if (0 !== i%width){
                count += fill(map, hints, width, i - 1);
                count += fill(map, hints, width, i - width - 1);
                count += fill(map, hints, width, i + width - 1);
            }
            if (0 !== (i+1)%width){
                count += fill(map, hints, width, i + 1);
                count += fill(map, hints, width, i - width + 1);
                count += fill(map, hints, width, i + width + 1);
            }
        }
        return count;
    };

    // evt = {tileSet:tileSet, tileWidth:64, tileHeight:64, mapWidth:8, mapHeight:8, level:0, playerJob:game.PRIEST}
    me.init = function(game, data){
        game.tileSet = data.tileSet;
        game.heroJob = data.heroJob;
        game.mapLevel = data.mapLevel;
        var sd = game.smallDevice = data.smallDevice;
        game.tileWidth = sd ? 32 : 64;
        game.tileHeight = sd ? 32 : 64;
        mapParams = G_MAP_PARAMS[game.mapLevel];
        game.mapWidth = mapParams[0];
        game.mapHeight = mapParams[1];
        game.creepCount = mapParams[2];
        game.chestCount = mapParams[3];

        var
        shuffle = [],
        map = game.map,
        mapW = game.mapWidth, mapH = game.mapHeight,
        hints = game.hints,
        objects = game.objects,
        flags = game.flags,
        i, l, c, hint;

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
        for(i=0,l=game.creepCount; i<l; i++){
            c = shuffle.splice(Math.floor(Math.random()*shuffle.length), 1)[0];
            map[c] |= G_TILE_TYPE.CREEP;
            objects[c] = G_CREEP.MOUSE + Math.floor(Math.random() * (G_CREEP.DEVIL - G_CREEP.MOUSE));
        }

        // add chests
        for(i=0,l=game.chestCount; i<l; i++){
            c = shuffle.splice(Math.floor(Math.random()*shuffle.length), 1)[0];
            map[c] |= G_TILE_TYPE.CHEST;
            objects[c] = G_OBJECT.CHEST_CLOSED;
        }

        c = shuffle.splice(Math.floor(Math.random()*shuffle.length), 1)[0];
        map[c] |= G_TILE_TYPE.STAIR_DOWN;
        objects[c] = G_FLOOR.STAIR_DOWN;

        for(i=0,l=mapW*mapH; i<l; i++){
            if (map[i] > G_TILE_TYPE.HIDE) continue;
            hint = 0;
            hint = getTileHint(hint, map[i-mapW]);
            hint = getTileHint(hint, map[i+mapW]);
            if (0 !== i%mapW){
                hint = getTileHint(hint, map[i-1]);
                hint = getTileHint(hint, map[i-mapW-1]);
                hint = getTileHint(hint, map[i+mapW-1]);
            }
            if (0 !== (i+1)%mapW){
                hint = getTileHint(hint, map[i+1]);
                hint = getTileHint(hint, map[i-mapW+1]);
                hint = getTileHint(hint, map[i+mapW+1]);
            }
            hints[i] = hint;
        }

        c = shuffle.splice(Math.floor(Math.random()*shuffle.length), 1)[0];
        objects[c] = G_FLOOR.STAIR_UP;
        game.heroPos = c;

        fill(map, hints, mapW, game.heroPos);

        map[c] = G_TILE_TYPE.STAIR_UP; // must do after fill, becos fill will ignore revealed tile
    };

    me.explore = function(elapsed, evt, entities){
        var mapOpt, e;
        for(var i=0,l=entities.length; i<l; i++){
            e = entities[i];
            mapOpt = e.getComponent(name);
            if (mapOpt) break;
        }
        if (!mapOpt) return entities;

        var
        map = this.map,
        hints = this.hints,
        mapW = this.mapWidth,
        mapH = this.mapHeight,
        tileW = this.tileWidth,
        tileH = this.tileHeight,
        x = Math.floor(evt.x / tileW),
        y = Math.floor(evt.y / tileH),
        id, tileType;

        if (y > mapH || x > mapW) return;
        id = mapW * y + x;
        tileType = map[id];

        if (tileType & G_TILE_TYPE.CREEP) this.go('showInfo', {creepId:this.objects[id]});
        else this.go('hideInfo');

        if (!(tileType | G_TILE_TYPE.HIDE)) return;

        fill(map, hints, mapW, id);

        return entities;
    };
});
