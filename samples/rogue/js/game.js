pico.def('game', 'pigSqrMap', function(){
    this.use('god');
    this.use('hero');
    this.use('ai');

    var
    me = this,
    db = window.localStorage,
    Max = Math.max,
    Abs = Math.abs,
    Floor = Math.floor,
    Random = Math.random,
    Pow = Math.pow,
    Sqrt = Math.sqrt,
    pathElapsed = 0,
    loadGame = function(){
        var text = db.getItem(me.moduleName);
        if (!text) return false;

        var
        obj = JSON.parse(text),
        keys = Object.keys(obj),
        key;

        Object.getPrototypeOf(me).init(obj.mapWidth, obj.mapHeight);

        for(var i=0,l=keys.length; i<l; i++){
            key = keys[i];
            me[key] = obj[key];
        }
        return true;
    },
    saveGame = function(){
        db.setItem(me.moduleName, JSON.stringify({
                currentLevel: me.currentLevel,
                prevLevel: me.prevLevel,
                nextLevel: me.nextLevel,
                deepestLevel: me.deepestLevel,
                exitIndex: me.exitIndex,
                mapWidth: me.mapWidth,
                mapHeight: me.mapHeight,
                map: me.map,
                terrain: me.terrain,
                hints: me.hints,
                objects: me.objects,
                flags: me.flags,
                heaven: me.heaven,
                mortal: me.mortal,
                mortalLoc: me.hero.getPosition()
            }));
    },
    createLevel = function(level){
        me.prevLevel = level ? me.currentLevel : 0;
        me.currentLevel = level;
        me.nextLevel = (me.currentLevel < me.prevLevel) ? me.currentLevel-1 : me.currentLevel+1;

        var mapParams = G_MAP_PARAMS[level];
        Object.getPrototypeOf(me).init(mapParams[0], mapParams[1]);

        if (me.currentLevel) generateRandomLevel(mapParams[2], mapParams[3]);
        else populateStaticLevel();

        me.hero.levelUp(level);
    },
    isOpen = function(i){
        var
        o = me.objects[i],
        m = me.map[i];
        return (undefined !== m && !(m & G_TILE_TYPE.HIDE) && !o);
    },
    heuristic = function(from, to){
        var mw = me.mapWidth;
        return Sqrt(Pow(from%mw - to%mw, 2) + Pow(Floor(from/mw) - Floor(to/mw), 2));
    },
    getTileHint = function(hint, type){
        if (type & G_TILE_TYPE.OBSTACLES){
            hint |= type;
            hint += 0x10;
        }
        return hint;
    },
    fill = function(map, hints, width, i){
        var count = 0;
        if (i < 0 || isOpen(i)) return count;
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
        ai = me.ai,
        hero = me.hero,
        objects = me.objects,
        hints = me.hints,
        flags = me.flags,
        OBJ = G_TOWN_MAP.objects,
        item;

        objects.length = 0;
        hints.length = 0;
        flags.length = 0;
        
        for(var i=0,l=OBJ.length; i<l; i++){
            if (OBJ[i]){
                item = G_OBJECT[OBJ[i]].slice();
                item[OBJECT_NAME] = G_OBJECT_NAME[OBJ[i]];
                objects[i] = item;
            }
        }

        me.map = G_TOWN_MAP.map.slice();
        me.terrain = G_TOWN_MAP.terrain.slice();
        hero.move(G_TOWN_MAP.heroPos);
    },
    generateRandomLevel = function(creepCount, chestCount){
        var
        ai = me.ai,
        hero = me.hero,
        map = me.map,
        mapW = me.mapWidth, mapH = me.mapHeight, mapSize = mapW*mapH,
        terrain = me.terrain,
        hints = me.hints,
        objects = me.objects,
        flags = me.flags,
        shuffle = [],
        i, l, c;

        map.length = 0;
        terrain.length = 0;
        hints.length = 0;
        objects.length = 0;
        flags.length = 0;

        for(i=0, l=mapSize; i<l; i++){
            map.push(G_TILE_TYPE.HIDE);
            terrain.push(G_FLOOR.CLEAR);
            hints.push(9); // default is invalid count
            shuffle.push(i);
        }

        // add creeps
        for(i=0,l=creepCount; i<l; i++){
            c = shuffle.splice(Floor(Random()*shuffle.length), 1)[0];
            map[c] |= G_TILE_TYPE.CREEP;
            objects[c] = ai.spawnCreep(me.currentLevel);
        }
        objects[c][CREEP_ITEM] = G_OBJECT[G_ICON.KEY_GATE].slice();

        // add chests
        for(i=0,l=chestCount; i<l; i++){
            c = shuffle.splice(Floor(Random()*shuffle.length), 1)[0];
            map[c] |= G_TILE_TYPE.CHEST;
            objects[c] = ai.spawnChest();
        }

        me.recalHints();
        
        var tomb = me.god.getTomb(me.currentLevel);
        if (tomb){
            c = shuffle.splice(Floor(Random()*shuffle.length), 1)[0];
            objects[c] = tomb;
        }

        c = shuffle.splice(Floor(Random()*shuffle.length), 1)[0];
        me.exitIndex = c;
        map[c] |= G_TILE_TYPE.EXIT;
        terrain[c] = me.deepestLevel < me.currentLevel ? G_FLOOR.LOCKED : me.prevLevel < me.currentLevel ? G_FLOOR.STAIR_DOWN : G_FLOOR.STAIR_UP;

        c = shuffle.splice(Floor(Random()*shuffle.length), 1)[0];
        terrain[c] = me.prevLevel < me.currentLevel ? G_FLOOR.STAIR_UP : G_FLOOR.STAIR_DOWN;
        hero.move(c);

        fill(map, hints, mapW, c);

        map[c] = G_TILE_TYPE.ENTRANCE; // must do after fill, becos fill will ignore revealed tile
    };

    me.tileSet = null;
    me.smallDevice = false;
    me.tileWidth = 16;
    me.tileHeight = 16;
    me.currentLevel = 0;
    me.prevLevel = 0;
    me.nextLevel = 0;
    me.deepestLevel = 0;
    me.heaven = undefined;
    me.mortal = undefined;
    me.mortalLoc = undefined;
    me.terrain = [];
    me.hints = []; // 08:creep, 80:chest, 800:stair:
    me.objects = [];
    me.flags = [];

    // data = {tileSet:tileSet, smallDevice: 0:1}
    me.init = function(data){
        me.tileSet = data.tileSet;

        var sd = me.smallDevice = data.smallDevice;
        me.tileWidth = sd ? 32 : 64;
        me.tileHeight = sd ? 32 : 64;

        var loaded = loadGame();

        if (!loaded){
            var keys = Object.keys(G_CREEP_TEAM);
            me.theme = keys[Floor(Random()*keys.length)];
        }

        me.heaven = me.god.init.call(me);
        me.mortal = me.hero.init.call(me);
        me.objects = me.ai.init.call(me);

        if (!loaded)
            createLevel(me.currentLevel);
    };

    me.exit = function(evt){
        me.ai.exit();
        me.hero.exit();
        me.god.exit();

        //saveGame();
    };

    me.step = function(elapsed, steps, entities){
        if (!steps) return;
        me.god.step.call(me, steps);
        me.hero.step.call(me, steps);
        me.ai.step.call(me, steps);

        return entities;
    };

    // call when player obtain the key
    me.unlockLevel = function(level){
        if (me.deepestLevel < level){
            me.deepestLevel = level;
            me.terrain[c] = me.prevLevel < me.currentLevel ? G_FLOOR.STAIR_DOWN : G_FLOOR.STAIR_UP;
        }
    };

    me.openChest = function(elapsed, evt, entities){
        var
        hero = this.hero,
        object = this.objects[evt],
        loot = object[CHEST_ITEM];

        if (!loot) {
            loot = object[CHEST_ITEM] = this.ai.openChest(hero.getJob(), hero.getLuck(), this.currentLevel);
        }

        me.go('showDialog', {
        info: [
            'You have discovered a '+G_OBJECT_TYPE_NAME[loot[OBJECT_TYPE]],
            'Item name '+loot[OBJECT_NAME]+', item level '+loot[OBJECT_LEVEL]+', item grade '+G_GRADE_NAME[loot[OBJECT_GRADE]]],
        callbacks: ['loot', undefined],
        labels: ['Loot', 'Discard'],
        evt: evt});

        delete this.flags[evt];

        return entities;
    };

    me.openGate = function(elapsed, evt, entities){
        var
        map = this.map,
        terrain = this.terrain;

        var i = me.exitIndex;
        tileType = map[i];
        if (!(tileType & G_TILE_TYPE.HIDE) && tileType & G_TILE_TYPE.EXIT){
            terrain[i] = me.prevLevel < me.currentLevel ? G_FLOOR.STAIR_DOWN : G_FLOOR.STAIR_UP;
            delete this.objects[evt];
            return entities;
        }
        this.go('showInfo', {
            info: 'Dungeon gate is unallocated yet, find it first',
        });
    };

    me.attackAnim = function(elapsed, evt, entities){
        var msg = evt[0];
        if (!msg) {
            this.go('counter', evt);
            return;
        }
        this.go('showInfo', { info: msg} );

        var
        hero = this.hero,
        objects = this.objects,
        targetId = hero.getTargetId(),
        pos = hero.getPosition(),
        creep = objects[targetId];

        hero.move(targetId);

        setTimeout(function(){
            hero.move(pos); // hero must move first
            objects[targetId] = creep;
            if (evt[1]){
                me.go('counter', evt);
            }else{
                if (me.ai.bury(targetId)){
                    hero.setTargetId(undefined);
                }
            }
            me.go('forceRefresh');
        }, 500);

        return entities;
    };

    me.counterAnim = function(elapsed, evt, entities){
        var msg = evt[1];
        if (!msg) return;

        this.go('showInfo', {info: msg});

        var
        hero = this.hero,
        targetId = hero.getTargetId(),
        objects = this.objects,
        pos = hero.getPosition(),
        creep = objects[targetId];

        objects[targetId] = undefined;
        objects[pos] = creep;
        setTimeout(function(){
            if (hero.isDead()){
                hero.setTargetId(undefined);
                objects[pos] = G_OBJECT[G_ICON.SKELETON].slice();
                me.hero.bury(me.god);
                me.go('showDialog', {
                info: [
                    'RIP',
                    'you were killed by '+creep[OBJECT_NAME]+' at level '+me.currentLevel,
                    'but your lineage will continue...'],
                callbacks: ['reborn']});
            }else{
                hero.move(pos);

                objects[targetId] = creep;
                if (me.ai.bury(targetId)){
                    hero.setTargetId(undefined);
                }
                me.go('forceRefresh');
            }
        }, 500);
    };

    me.flee = function(elapsed, evt, entities){
        var ret = this.hero.flee();
        if (!ret) return;

        if (!ret[0]){
            this.go('counter', [undefined, ret[1]]);
            return;
        }
        this.go('showInfo', {info: ret[1]});
        return entities;
    };

    me.gotoLevel = function(elapsed, level, entities){
        var keys = Object.keys(G_CREEP_TEAM);
        me.theme = keys[Floor(Random()*keys.length)];

        me.objects = me.ai.init.call(me);

        createLevel(level);

        me.go('resize', [0, 0, window.innerWidth, window.innerHeight]);
        return entities;
    };

    me.reborn = function(elapsed, evt, entities){
        me.deepestLevel = 0;
        me.mortal = undefined;
        me.mortal = me.hero.init.call(me);

        createLevel(0);

        me.go('resize', [0, 0, window.innerWidth, window.innerHeight]);
        return entities;
    };

    me.recalHints = function(){
        var
        map = me.map,
        hints = me.hints,
        mapW = me.mapWidth, mapH = me.mapHeight,
        hint;

        hints.length = 0;

        for(var i=0,l=mapW*mapH; i<l; i++){
            if (map[i] & G_TILE_TYPE.OBSTACLES) continue;
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
    };

    me.fillTiles = function(i){
        return fill(me.map, me.hints, me.mapWidth, i);
    };

    me.nearToHero = function(i){
        return this.isTouching(me.hero.getPosition(), i);
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
        if (10 > hint) return 0;

        var
        map = this.map,
        flags = this.flags,
        width = this.mapWidth,
        neighbours = this.getNeighbours(pos, function(){return true;}),
        count = 1, // hint always has one/hidden
        tileIdx, tile, i, l;

        for(i=0,l=neighbours.length; i<l; i++){
            tileIdx = neighbours[i];
            tile = map[tileIdx];
            
            if (!(tile & G_TILE_TYPE.HIDE) && ((tile & G_TILE_TYPE.CHEST || tile & G_TILE_TYPE.CREEP))){
                // mark creep
                count |= tile;
                count += 0x10;
            }
        }
        if (count !== hint) return 0;

        count = 0;
        for(i=0,l=neighbours.length; i<l; i++){
            tileIdx = neighbours[i];
            if (map[tileIdx] & G_TILE_TYPE.HIDE && !flags[tileIdx])
                count += fill(map, hints, width, tileIdx);
        }

        return count;
    };

    me.heroMoveTo = function(elapsed, evt, entities){
        var h = this.findPath(this.hero.getPosition(), evt[0]);
        if (h.length){
            this.stopLoop('heroMove');
            this.startLoop('heroMove', h);
        }

        return;
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

        var p = evt.pop();

        me.hero.move(p);

        return [e];
    };

    me.heroStop = function(elapsed, evt, entities){
        var
        hp = me.hero.getPosition(),
        tileType = this.map[hp];
        if(tileType & G_TILE_TYPE.ENTRANCE){
            this.go('showDialog', {
                info: ['Warning!', 'you are leaving level '+this.currentLevel, 'Click on Yes to proceed to level '+(this.prevLevel)],
                labels: ['Yes', 'No'],
                callbacks: ['gotoLevel', null],
                evt:this.prevLevel});
        }else if(tileType & G_TILE_TYPE.EXIT){
            if (G_FLOOR.LOCKED !== this.terrain[hp]) {
                if (this.currentLevel){
                this.go('showDialog', {
                    info: ['Congratulations!', 'you have solved level '+this.currentLevel, 'Click on message box to proceed to level '+(this.nextLevel)],
                    callbacks: ['gotoLevel'],
                    evt: this.nextLevel});
                }else{
                    this.go('gotoLevel', this.nextLevel);
                }
            }
            return entities;
        }
    };
});
