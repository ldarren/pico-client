pico.def('game', 'picGroup', function(){

    var
    me = this,
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

    me.tileSet = null;
    me.smallDevice = false;
    me.tileWidth = 16;
    me.tileHeight = 16;
    me.mapWidth = 160;
    me.mapHeight = 160;
    me.mapLevel = 0;
    me.heroJob = G_HERO.ROGUE;
    me.heroPos = 0;
    me.creepCount = 0;
    me.chestCount = 0;
    me.map = [];
    me.hints = []; // 08:creep, 80:chest, 800:stair:
    me.objects = [];
    me.flags = [];
    me.skillBook = [G_MARK.EYE_OF_GOD];
    me.inventory = [G_OBJECT.KEY_02];
    me.activatedSkill = 0;

    // evt = {tileSet:tileSet, tileWidth:64, tileHeight:64, mapWidth:8, mapHeight:8, level:0, playerJob:game.PRIEST}
    me.init = function(data){
        me.tileSet = data.tileSet;
        me.heroJob = data.heroJob;
        me.mapLevel = data.mapLevel;
        var sd = me.smallDevice = data.smallDevice;
        me.tileWidth = sd ? 32 : 64;
        me.tileHeight = sd ? 32 : 64;
        mapParams = G_MAP_PARAMS[me.mapLevel];
        me.mapWidth = mapParams[0];
        me.mapHeight = mapParams[1];
        me.creepCount = mapParams[2];
        me.chestCount = mapParams[3];

        var
        shuffle = [],
        map = me.map,
        mapW = me.mapWidth, mapH = me.mapHeight,
        hints = me.hints,
        objects = me.objects,
        flags = me.flags,
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
        for(i=0,l=me.creepCount; i<l; i++){
            c = shuffle.splice(Math.floor(Math.random()*shuffle.length), 1)[0];
            map[c] |= G_TILE_TYPE.CREEP;
            objects[c] = G_CREEP.MOUSE + Math.floor(Math.random() * (G_CREEP.DEVIL - G_CREEP.MOUSE));
        }

        // add chests
        for(i=0,l=me.chestCount; i<l; i++){
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
        me.heroPos = c;

        fill(map, hints, mapW, me.heroPos);

        map[c] = G_TILE_TYPE.STAIR_UP; // must do after fill, becos fill will ignore revealed tile
    };

    me.checkResult = function(elapsed, evt, entities){
        var
        mapW = this.mapWidth,
        mapH = this.mapHeight,
        objects = this.objects,
        flags = this.flags,
        won = true;
        for(var w=0, wl=mapW*mapH; w<wl; w++){
            if (objects[w] >= G_CREEP.MOUSE && objects[w] <= G_CREEP.DEVIL && !flags[w]){
                won = false;
                break;
            }
        }
        if (won) {
            alert('You have Won!');
            this.init({tileSet:this.tileSet, smallDevice: this.smallDevice, mapLevel:this.mapLevel+1, heroJob:this.heroJob});
            this.go('resize', [0, 0, window.innerWidth, innerHeight]);
            return entities;
        }
    };

    me.fillTiles = function(i){
        return fill(me.map, me.hints, me.mapWidth, i);
    };
});
