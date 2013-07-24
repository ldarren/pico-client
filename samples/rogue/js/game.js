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
    },
    populateStaticLevel = function(){
        var
        mapW = me.mapWidth, mapH = me.mapHeight,
        hints = me.hints,
        flags = me.flags,
        i, l, c;

        hints.length = 0;
        flags.length = 0;

        me.map = G_TOWN_MAP.map.slice();
        me.terrain = G_TOWN_MAP.terrain.slice();
        me.objects = G_TOWN_MAP.objects.slice();
        me.heroPos = G_TOWN_MAP.heroPos;
        me.objects[me.heroPos] = me.heroJob;
    },
    generateRandomLevel = function(){
        var
        shuffle = [],
        map = me.map,
        terrain = me.terrain,
        mapW = me.mapWidth, mapH = me.mapHeight,
        hints = me.hints,
        objects = me.objects,
        flags = me.flags,
        i, l, c, hint;

        map.length = 0;
        terrain.length = 0;
        hints.length = 0;
        objects.length = 0;
        flags.length = 0;

        for(i=0, l=mapW*mapH; i<l; i++){
            map.push(G_TILE_TYPE.HIDE);
            terrain.push(G_FLOOR.CLEAR);
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
        terrain[c] = G_FLOOR.STAIR_DOWN;

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
        terrain[c] = G_FLOOR.STAIR_UP;
        objects[c] = me.heroJob;
        me.heroPos = c;

        fill(map, hints, mapW, me.heroPos);

        map[c] = G_TILE_TYPE.STAIR_UP; // must do after fill, becos fill will ignore revealed tile
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
    me.terrain = [];
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
        var mapParams = G_MAP_PARAMS[me.mapLevel];
        me.mapWidth = mapParams[0];
        me.mapHeight = mapParams[1];
        me.creepCount = mapParams[2];
        me.chestCount = mapParams[3];

        if (me.mapLevel) generateRandomLevel();
        else populateStaticLevel();
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
            this.go('showDialog', {
                info: ['Congratulations!', 'you have cleared level '+this.mapLevel, 'Click on message box to proceed to level '+(this.mapLevel+1)],
                callback: 'nextLevel'});
            return entities;
        }
    };

    me.nextLevel = function(elapsed, evt, entities){
        me.init({tileSet:this.tileSet, smallDevice: this.smallDevice, mapLevel:this.mapLevel+1, heroJob:this.heroJob});
        me.go('resize', [0, 0, window.innerWidth, window.innerHeight]);
        return entities;
    };

    me.prevLevel = function(elapsed, evt, entities){
        me.init({tileSet:this.tileSet, smallDevice: this.smallDevice, mapLevel:this.mapLevel-1, heroJob:this.heroJob});
        me.go('resize', [0, 0, window.innerWidth, window.innerHeight]);
        return entities;
    };

    me.fillTiles = function(i){
        return fill(me.map, me.hints, me.mapWidth, i);
    };

    me.nearToHero = function(i){
        var
        mapW = this.mapWidth,
        mapH = this.mapHeight,
        p = this.heroPos;

        if (i === (p-mapW) || i === (p+mapW) ||
            (0 !== (p%mapW) && (i === (p-1) || i === (p-mapW-1) || i === (p+mapW-1))) ||
            (0 !== ((p+1)%mapW) && (i === (p+1) || i === (p-mapW+1) || i === (p+mapW+1)))) return true;
        return false;
    };

    me.tileNextTo = function(i){
        var
        map = this.map,
        mapW = this.mapWidth,
        mapH = this.mapHeight,
        h,
        check = function(){
            var m = map[h];
            return (undefined !== m && !(m & G_TILE_TYPE.HIDE));
        };

        h = i+mapW;
        if (check()) return h;
        h = i-mapW;
        if (check()) return h;
        if (0 !== (i%mapW)){
            h = i-1;
            if (check()) return h;
            h = i-mapW-1;
            if (check()) return h;
            h = i+mapW-1;
            if (check()) return h;
        }
        if (0 !== ((i+1)%mapW)){
            h = i+1;
            if (check()) return h;
            h = i-mapW+1;
            if (check()) return h;
            h = i+mapW+1;
            if (check()) return h;
        }
        return -1;
    };
});
