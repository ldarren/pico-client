pico.def('game', 'pigSqrMap', function(){

    var
    me = this,
    Max = Math.max,
    Abs = Math.abs,
    Floor = Math.floor,
    Random = Math.random,
    Pow = Math.pow,
    Sqrt = Math.sqrt,
    pathElapsed = 0,
    isOpen = function(i){
        var
        o = me.objects[i],
        m = me.map[i];
        return (undefined !== m && !(m & G_TILE_TYPE.HIDE) && !o);
    },
    heuristic = function(from, to){
        var mw = me.mapWidth
        return Sqrt(Pow(from%mw - to%mw, 2) + Pow(Floor(from/mw) - Floor(to/mw), 2));
    },
    getTileHint = function(hint, type){
        if (type & G_TILE_TYPE.OBSTACLES){
            hint |= type;
            hint += 0x10;
        }
        return hint;
    },
    fill = function(map, hints, flags, width, i){
        var count = 0;
        if (i < 0 || isOpen(i) || flags[i]) return count;
        map[i] &= G_TILE_TYPE.SHOW;
        count = 1;
        if (0 === hints[i]){
            count += fill(map, hints, flags, width, i - width);
            count += fill(map, hints, flags, width, i + width);
            if (0 !== i%width){
                count += fill(map, hints, flags, width, i - 1);
                count += fill(map, hints, flags, width, i - width - 1);
                count += fill(map, hints, flags, width, i + width - 1);
            }
            if (0 !== (i+1)%width){
                count += fill(map, hints, flags, width, i + 1);
                count += fill(map, hints, flags, width, i - width + 1);
                count += fill(map, hints, flags, width, i + width + 1);
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
    generateRandomLevel = function(lastLevel){
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
            c = shuffle.splice(Floor(Random()*shuffle.length), 1)[0];
            map[c] |= G_TILE_TYPE.CREEP;
            objects[c] = G_CREEP.RAT + Floor(Random() * (G_CREEP.DEVIL - G_CREEP.RAT));
        }

        // add chests
        for(i=0,l=me.chestCount; i<l; i++){
            c = shuffle.splice(Floor(Random()*shuffle.length), 1)[0];
            map[c] |= G_TILE_TYPE.CHEST;
            objects[c] = G_OBJECT.CHEST;
        }

        c = shuffle.splice(Floor(Random()*shuffle.length), 1)[0];
        map[c] |= G_TILE_TYPE.EXIT;
        terrain[c] = me.nextLevel > me.currentLevel ? G_FLOOR.STAIR_DOWN : G_FLOOR.STAIR_UP;

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

        c = shuffle.splice(Floor(Random()*shuffle.length), 1)[0];
        terrain[c] = me.prevLevel < me.currentLevel ? G_FLOOR.STAIR_UP : G_FLOOR.STAIR_DOWN;
        objects[c] = me.heroJob;
        me.heroPos = c;

        fill(map, hints, flags, mapW, me.heroPos);

        map[c] = G_TILE_TYPE.ENTRANCE; // must do after fill, becos fill will ignore revealed tile
    };

    me.tileSet = null;
    me.smallDevice = false;
    me.tileWidth = 16;
    me.tileHeight = 16;
    me.currentLevel = 0;
    me.prevLevel = 0;
    me.nextLevel = 0;
    me.heroJob = G_HERO.ROGUE;
    me.heroPos = 0;
    me.creepCount = 0;
    me.chestCount = 0;
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
        me.prevLevel = data.mapLevel ? me.currentLevel : 0;
        me.currentLevel = data.mapLevel;
        me.nextLevel = (me.currentLevel < me.prevLevel) ? me.currentLevel-1 : me.currentLevel+1;

        var mapParams = G_MAP_PARAMS[me.currentLevel];
        Object.getPrototypeOf(this).init(mapParams[0], mapParams[1]);
        me.creepCount = mapParams[2];
        me.chestCount = mapParams[3];

        var sd = me.smallDevice = data.smallDevice;
        me.tileWidth = sd ? 32 : 64;
        me.tileHeight = sd ? 32 : 64;

        if (me.currentLevel) generateRandomLevel();
        else populateStaticLevel();
    };

    me.gotoLevel = function(elapsed, evt, entities){
        me.init({tileSet:this.tileSet, smallDevice: this.smallDevice, mapLevel:evt, heroJob:this.heroJob});
        me.go('resize', [0, 0, window.innerWidth, window.innerHeight]);
        return entities;
    };

    me.reborn = function(elapsed, evt, entities){
        me.init({tileSet:this.tileSet, smallDevice: this.smallDevice, mapLevel:0, heroJob:Math.floor(G_HERO.ROGUE + Math.random()*(G_HERO.WARLOCK-G_HERO.ROGUE))});
        me.go('resize', [0, 0, window.innerWidth, window.innerHeight]);
        return entities;
    };

    me.fillTiles = function(i){
        return fill(me.map, me.hints, me.flags, me.mapWidth, i);
    };

    me.nearToHero = function(i){
        return this.isTouching(this.heroPos, i);
    };

    me.nextTile = function(at, toward){
        return this.getNeighbour(at, toward, isOpen, heuristic);
    };

    me.findPath = function(from, to){
        return this.aStar(from, to, isOpen, this.getNeighbours, heuristic);
    };

    me.solve = function(pos){
        var
        hints = this.hints,
        hint = hints[pos];
        if (10 > hint) return false;

        var
        map = this.map,
        flags = this.flags,
        width = this.mapWidth,
        neighbours = this.getNeighbours(pos, function(){return true;}),
        count = 1, // hint always has one
        tileIdx, tile, i, l;

        for(i=0,l=neighbours.length; i<l; i++){
            tileIdx = neighbours[i];
            tile = map[tileIdx];
            
            if (tile & G_TILE_TYPE.HIDE){ 
                if (flags[tileIdx] && tile & G_TILE_TYPE.CREEP){
                    // mark creep
                    count |= G_TILE_TYPE.CREEP;
                    count += 0x10;
                }
            }else if (tile & G_TILE_TYPE.EXIT || tile & G_TILE_TYPE.CHEST){
                // uncovered exit or chest
                count |= tile;
                count += 0x10;
            }
        }
        if (count !== hint) return false;

        for(i=0,l=neighbours.length; i<l; i++){
            tileIdx = neighbours[i];
            if (map[tileIdx] & G_TILE_TYPE.HIDE && !flags[tileIdx]) fill(map, hints, flags, width, tileIdx);
        }

        return true;
    };

    me.heroMove = function(elapsed, evt, entities){
        pathElapsed += elapsed;
        if (pathElapsed < 100) return;
        pathElapsed = 0;

        var e, o;
        for(var i=0, l=entities.length; i<l; i++){
            e = entities[i];
            o = e.getComponent('camera');
            if (o) break;
        }
        if (!o) return;

        if (!evt || !evt.length) {
            this.stopLoop('heroMove');
            this.go('heroStop');
            return;
        }

        var
        hp = this.heroPos,
        p = evt.pop();

        this.objects[hp] = undefined;
        this.heroPos = p;
        this.objects[p] = this.heroJob;
        return [e];
    };

    me.heroStop = function(elapsed, evt, entities){
        var tileType = this.map[this.heroPos];
        if(tileType & G_TILE_TYPE.ENTRANCE){
            this.go('showDialog', {
                info: ['Warning!', 'you are leaving level '+this.currentLevel, 'Click on message box to proceed to level '+(this.prevLevel)],
                callback: 'gotoLevel',
                evt:this.prevLevel});
        }else if(tileType & G_TILE_TYPE.EXIT){
            var
            mapW = this.mapWidth,
            mapH = this.mapHeight,
            objects = this.objects,
            flags = this.flags,
            won = true;
            for(var w=0, wl=mapW*mapH; w<wl; w++){
                if ((objects[w] >= G_CREEP.RAT && objects[w] <= G_CREEP.DEVIL && !flags[w]) || (!objects[w] && flags[w])){
                    won = false;
                    break;
                }
            }
            if (won) {
                this.go('showDialog', {
                    info: ['Congratulations!', 'you have cleared level '+this.currentLevel, 'Click on message box to proceed to level '+(this.nextLevel)],
                    callback: 'gotoLevel',
                    evt: this.nextLevel});
            }else{
                this.go('showDialog', {
                    info: ['Sorry', 'Level '+this.currentLevel+' is not cleared yet', 'Click on message box to close']});
                return entities;
            }
            return entities;
        }
    };
});
