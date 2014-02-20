pico.def('game', 'pigSqrMap', function(){
    this.use('god');
    this.use('hero');
    this.use('ai');

    var
    me = this,
    db = window.localStorage,
    fingerStack = [],
    Max=Math.max,Abs=Math.abs,Floor=Math.floor,Random=Math.random,Pow=Math.pow,Sqrt=Math.sqrt,
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
                mapWidth: me.mapWidth,
                mapHeight: me.mapHeight,
                map: me.map,
                terrain: me.terrain,
                objects: me.objects,
                exitIndex: me.exitIndex,
                hints: me.hints,
                flags: me.flags,
                heaven: me.heaven,
                mortal: me.mortal,
                mortalLoc: me.hero.getPosition()
            }));
    },
    createLevel = function(level){
        me.prevLevel = level ? me.currentLevel : 0;
        me.currentLevel = level;
        me.nextLevel = (level < me.prevLevel) ? level-1 : level+1;
        if (me.deepestLevel < level) me.deepestLevel = level;

        var mapParams = G_MAP_PARAMS[level];
        Object.getPrototypeOf(me).init(mapParams[0], mapParams[1]);

        if (!populateStaticLevel(level)) generateRandomLevel(mapParams[2], mapParams[3]);
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
        if (i < 0 || !(map[i] & G_TILE_TYPE.HIDE)) return count;
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
    prepareTutorial = function(level){
        if (!level) return 0;

        var
        map = me.map,
        objects = me.objects,
        ai = me.ai,
        isDone = me.deepestLevel > level,
        tile,object,i,l;

        switch(level){
        case 1: // key
        case 2: // creep sweeping
            for(i=0,l=map.length;i<l;i++){
                tile = map[i];
                if (tile & G_TILE_TYPE.CREEP){
                    objects[i] = ai.spawnCreep(level);
                }
            }
            if (isDone){
                for(i=0,l=objects.length; i<l; i++){
                    var object = objects[i];
                    if (object && G_OBJECT_TYPE.KEY === object[OBJECT_TYPE]){
                        delete objects[i];
                        break;
                    }
                }
            }
            break;
        case 3: // combat
        case 4: // equip
            var creeps = [], chestId;
            for(i=0,l=map.length;i<l;i++){
                tile = map[i];
                if (tile & G_TILE_TYPE.CREEP){
                    creeps.push(i);
                    objects[i] = ai.spawnCreep(level);
                }
                if (tile & G_TILE_TYPE.CHEST){
                    chestId = i;
                }
            }
            objects[creeps[Floor(Random()*creeps.length)]][CREEP_ITEM] = G_CREATE_OBJECT(G_ICON.KEY_GATE);
            if (chestId){
                if (isDone){
                    objects[i] = G_CREATE_OBJECT(G_ICON.CHEST_EMPTY)
                }else{
                    object = G_CREATE_OBJECT(G_ICON.CHEST);
                    object[CHEST_ITEM] = ai.spawnItem(G_ICON.ROBE, G_GRADE.ENCHANTED, me.hero.getJob(), 1, 1);
                    objects[chestId] = object;
                }
            }
            break;
        }
    },
    populateStaticLevel = function(level){
        if (level >= G_STATIC_MAP.length) return false;

        var
        staticMap = G_STATIC_MAP[level],
        objects = me.objects,
        hints = me.hints,
        flags = me.flags,
        OBJ = staticMap.objects,
        terrain, hints, i, l;

        objects.length = 0;
        hints.length = 0;
        flags.length = 0;

        me.map = staticMap.map.slice();
        terrain = me.terrain = staticMap.terrain.slice();
        me.flags = staticMap.flags.slice();
        me.mortalLoc = staticMap.heroPos;
        me.exitIndex = undefined;

        var
        sealDoor = (level && me.deepestLevel <= level ? G_FLOOR.STAIR_DOWN : -1),
        goinUp = level < me.prevLevel,
        ground = (undefined === me.mortalLoc ? (goinUp ? G_FLOOR.STAIR_DOWN : G_FLOOR.STAIR_UP) : -1),
        tile;
       
        if (level && goinUp){
            for(i=0,l=me.map.length; i<l; i++){
                tile = me.map[i];
                if (tile & G_TILE_TYPE.EXIT){
                    me.map[i] = tile & G_TILE_TYPE.HIDE | G_TILE_TYPE.ENTRANCE;
                }else if (tile & G_TILE_TYPE.ENTRANCE){
                    me.map[i] = tile & G_TILE_TYPE.HIDE | G_TILE_TYPE.EXIT;
                }
            }
        }

        for(i=0,l=terrain.length; i<l; i++){
            if (ground === terrain[i]){
                me.mortalLoc = i;
                ground = -1;
            }
            if (sealDoor === terrain[i]){
                terrain[i] = G_FLOOR.LOCKED;
                me.exitIndex = i;
                sealDoor = -1;
            }
            if (-1 === sealDoor && -1 === ground) break;
        }

        for(i=0,l=OBJ.length; i<l; i++){
            if (OBJ[i]){
                objects[i] = G_CREATE_OBJECT(OBJ[i]);
            }
        }

        if (staticMap.hints){
            me.hints = staticMap.hints.slice();
        }else{
            hints = me.hints = [];
            for(i=0,l=terrain.length; i<l; i++){
                hints[i] = 9;
            }
            me.recalHints();
            fill(me.map, hints, me.mapWidth, me.mortalLoc);
        }

        prepareTutorial(level);

        return true;
    },
    generateRandomLevel = function(creepCount, chestCount){
        var
        ai = me.ai,
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
        objects[c][CREEP_ITEM] = G_CREATE_OBJECT(G_ICON.KEY_GATE);

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
        terrain[c] = me.deepestLevel <= me.currentLevel ? G_FLOOR.LOCKED : me.prevLevel < me.currentLevel ? G_FLOOR.STAIR_DOWN : G_FLOOR.STAIR_UP;

        if (!(me.currentLevel % 1)){
            c = shuffle.splice(Floor(Random()*shuffle.length), 1)[0];
            map[c] |= G_TILE_TYPE.WAYPOINT;
            terrain[c] = me.mortal && me.mortal.appearance[HERO_WAYPOINT] >= me.currentLevel ? G_FLOOR.WAYPOINT : G_FLOOR.WAYPOINT_NEW;
        }

        c = shuffle.splice(Floor(Random()*shuffle.length), 1)[0];
        terrain[c] = me.prevLevel < me.currentLevel ? G_FLOOR.STAIR_UP : G_FLOOR.STAIR_DOWN;
        me.mortalLoc = c;

        fill(map, hints, mapW, c);

        map[c] = G_TILE_TYPE.ENTRANCE; // must do after fill, becos fill will ignore revealed tile
    };

    me.tileSet = null;
    me.spellSet = null;
    me.audioSprite = null;
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
    me.map = [];
    me.terrain = [];
    me.hints = []; // 08:creep, 80:chest, 800:stair:
    me.objects = [];
    me.flags = [];

    // call in pageLogin onLoad
    me.load = function(){
        loadGame();
        return me.heaven ? me.heaven[1] : undefined;
    };

    // call in pageLogin onPlay 
    me.init = function(name){
        me.heaven = me.god.init.call(me, name);

        me.ai.changeTheme.call(me);

        if (!me.map.length)
            createLevel(me.currentLevel);

        me.ai.init.call(me);
    };

    me.exit = function(evt){
        me.objects = me.ai.exit.call(me);
        me.mortal = me.hero.exit.call(me);
        me.heaven = me.god.exit.call(me);

        //saveGame();
    };

    me.step = function(elapsed, steps, entities){
        if (!steps) return;
        me.god.step.call(me, steps);
        me.hero.step.call(me, steps);
        me.ai.step.call(me, steps);
        me.go('forceRefresh');

        return entities;
    };

    // data = {tileSet:atlas, spellSet:atlas, audioSprite: sprite, smallDevice: 0:1}
    me.style = function(data){
        me.tileSet = data.tileSet;
        me.spellSet = data.spellSet;
        me.audioSprite = data.audioSprite;

        var sd = me.smallDevice = data.smallDevice;
        me.tileWidth = sd ? 32 : 64;
        me.tileHeight = sd ? 32 : 64;
    };

    me.openChest = function(elapsed, evt, entities){
        var
        hero = this.hero,
        object = this.objects[evt],
        loot = object[CHEST_ITEM];

        if (!loot) {
            loot = object[CHEST_ITEM] = this.ai.openChest(hero.getJob(), hero.getStat(OBJECT_LUCK), this.currentLevel);
        }

        me.go('showDialog', {
        info: [
            'You have discovered a '+G_OBJECT_TYPE_NAME[loot[OBJECT_TYPE]],
            'Item name '+loot[OBJECT_NAME]+', item level '+loot[OBJECT_LEVEL]+', item grade '+G_GRADE_NAME[loot[OBJECT_GRADE]]],
        callbacks: ['loot', undefined],
        labels: ['Loot', 'Discard'],
        events: [evt, undefined]});

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

    me.castSpell = function(elapsed, evt, entities){
        var hero = this.hero;
        if (hero.castSpell.call(this, hero.getPosition())) return entities;
        return; // return nothing
    };

    me.forgetSpell = function(elapsed, evt, entities){
        var
        hero = this.hero,
        tome = hero.getTome(),
        spell = hero.getSelectedSpell();

        delete tome[tome.indexOf(spell)];

        hero.selectSpell();
        return entities;
    };

    me.attackAnim = function(elapsed, targets, entities){
        var hero = this.hero;

        if (!targets || !targets.length){
            me.go('counter', me.ai.battle());

            var
            flags = me.flags,
            engagedIds = hero.getEngaged();
            
            for(var i=0,l=engagedIds.length; i<l; i++){
                delete flags[engagedIds[i]]; // must do it after ai.battle to avoid flag creep attacks
            }
            return;
        }

        var
        objects = this.objects,
        targetId = targets[0][0],
        pos = hero.getPosition(),
        creep = objects[targetId];

        hero.move(targetId);

        setTimeout(function(){
            hero.move(pos); // hero must move first
            objects[targetId] = creep;
            me.go('forceRefresh');
            me.go('startEffect', {
                type:'damageEfx',
                targets:[targetId],
                callback: 'startEffect',
                event:{
                    type:'battleText',
                    targets:targets,
                    callback:'attack'
                }
            });
        }, 500);

        return entities;
    };

    me.counterAnim = function(elapsed, evt, entities){
        var
        hero = me.hero,
        pos = hero.getPosition(),
        ai = me.ai,
        targetId = evt[0].pop(),
        damage = evt[1].pop(),
        objects = this.objects,
        creep = objects[targetId];

        if (!creep){
            var engagedIds = hero.getEngaged();
            
            for(var i=0,l=engagedIds.length; i<l; i++){
                ai.bury(engagedIds[i]);
            }

            if (hero.isDead()){
                objects[pos] = G_CREATE_OBJECT(G_ICON.BONES);
                hero.bury(me.god);
                me.go('hideInfo');
                me.go('showDialog', {
                    info: [
                        'Ascending to Valhalla,',
                        'You were killed at level '+me.currentLevel,
                        'Death is permanent. Although you have died, all of your piety points and the dungeons you have explored will be ready on next trial'],
                    callbacks: ['resetWorld']});
            }else{
                engagedIds = hero.getEngaged();
                me.go('forceRefresh');
                if (engagedIds.length)
                    me.go('showInfo', { targetId:engagedIds[0], context:G_CONTEXT.WORLD});
            }
            return;
        }

        if (!hero.isEngaged(targetId) || !damage){
            this.go('counter', evt);
            return;
        }

        objects[targetId] = undefined;
        objects[pos] = creep;
        setTimeout(function(){
            me.go('forceRefresh');
            objects[targetId] = creep;
            hero.move(pos);
            ai.bury(targetId);
            me.go('startEffect', {
                type:'damageEfx',
                targets:[pos],
                callback: 'startEffect',
                event:{
                    type:'battleText',
                    targets:[damage],
                    callback:'counter',
                    event: evt
                }
            });
        }, 500);
        return entities;
    };

    me.flee = function(elapsed, evt, entities){
        var ret = this.hero.flee();
        if (!ret) return;

        if (!ret[0]){
            this.go('counter', [[], ret[1]]);
            return;
        }
        this.go('showInfo', {info: ret[1]});
        return entities;
    };

    me.battleEnd = function(elapsed, evt, entities){
        if (!evt || !evt.length) return;

        var
        objects = this.objects,
        ai = this.ai,
        obj, objId;

        for(var i=0,l=evt.length; i<l; i++){
            objId = evt[i];
            obj = objects[objId];
            switch(obj[OBJECT_TYPE]){
            case G_OBJECT_TYPE.CREEP:
                ai.bury(objId);
                break;
            case G_OBJECT_TYPE.CHEST:
                if (contact[OBJECT_SUB_TYPE] || contact[CHEST_ITEM]){
                    objects[objId] = G_CREATE_OBJECT(G_ICON.CHEST_EMPTY);
                }
                break;
            case G_OBJECT_TYPE.HERO:
            case G_OBJECT_TYPE.ENV:
            case G_OBJECT_TYPE.KEY:
                break;
            default:
                delete objects[objId];
                break;
            }
        }
        return entities;
    };

    me.gotoLevel = function(elapsed, level, entities){
        var
        ai = me.ai,
        hero = me.hero;

        ai.changeTheme.call(me);

        hero.move(undefined); // prevent hero.move deletes object at old map hero pos
        hero.clearEngaged();

        createLevel(level);

        hero.init.call(me, level);
        ai.init.call(me);

        me.go('resize', [0, 0, window.innerWidth, window.innerHeight]);
        return entities;
    };

    me.teleport = function(elapsed, level, entities){
        if (!this.currentLevel) me.hero.setLastPortal(0); // reset teleport level regardless of beam down or teleport down
        var ret = me.gotoLevel(elapsed, level, entities);
        this.prevLevel = this.prevLevel < level ? level - 1 : level + 1;
        return ret;
    };

    me.resetWorld = function(elpased, evt, entities){
        me.mortal = undefined;

        me.ai.changeTheme.call(me);

        createLevel(0);

        me.ai.init.call(me);

        me.go('showAltar', {callback:'reborn'});

        return entities;
    };

    me.reborn = function(elapsed, evt, entities){
        me.hero.init.call(me, 0);

        me.go('resize', [0, 0, window.innerWidth, window.innerHeight]);
        return entities;
    };

    me.recover = function(elapsed, evt, entities){
        var
        objects = this.objects,
        targetId = evt[0],
        tomb = objects[targetId];

        delete objects[targetId];

        me.hero.recoverBody(tomb[TOMB_BODY]);
    };

    me.createGoods = function(elapsed, evt, entities){
        var
        targetId = evt[0],
        target = me.objects[targetId];

        evt.length = 0;
        me.ai.createGoods(target[OBJECT_SUB_TYPE], evt);
        return entities;
    };

    me.chantScroll = function(elapsed, evt, entities){
        var
        targetId = evt[0],
        hero = me.hero,
        stat = hero.removeFromBag(targetId);

        switch(stat[OBJECT_SUB_TYPE]){
            case G_SCROLL_TYPE.MANUSCRIPT:
                hero.putIntoTome.call(this);
                break;
            case G_SCROLL_TYPE.IDENTITY:
                break;
            case G_SCROLL_TYPE.TELEPORT:
                hero.setLastWayPoint(this.currentLevel);
                this.go('teleport', 0);
                break;
            case G_SCROLL_TYPE.MAP:
                break;
        }
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

    me.getAllTouched = function(at){
        var
        objects = this.objects,
        touched = [],
        w = me.mapWidth,
        i;

        i = at-w;
        if (objects[i]) touched.push(i);
        i = at+w;
        if (objects[i]) touched.push(i);
        if (at%w){
            i = at-1;
            if (objects[i]) touched.push(i);
            i = at-w-1;
            if (objects[i]) touched.push(i);
            i = at+w-1;
            if (objects[i]) touched.push(i);
        }
        if ((at+1)%w){
            i = at+1;
            if (objects[i]) touched.push(i);
            i = at-w+1;
            if (objects[i]) touched.push(i);
            i = at+w+1;
            if (objects[i]) touched.push(i);
        }
        return touched;
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
        var target = evt[0];
        if (undefined === target) return;
        var h = this.findPath(this.hero.getPosition(), target);
        if (h.length && h[0] === target){
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
        hero = me.hero,
        hp = hero.getPosition(),
        tileType = this.map[hp];

        if(tileType & G_TILE_TYPE.ENTRANCE){
            this.go('showInfo', {
                info: 'Warning! you are leaving level '+this.currentLevel,
                labels: ['Goto Level '+this.prevLevel, 'Stay'],
                callbacks: ['gotoLevel', null],
                events:[this.prevLevel, null]});
        }else if(tileType & G_TILE_TYPE.EXIT){
            if (G_FLOOR.LOCKED !== this.terrain[hp]) {
                if (this.currentLevel && this.currentLevel === this.deepestLevel){
                this.go('showDialog', {
                    info: ['Congratulations!', 'you have unlocked level '+this.nextLevel],
                    labels: ['Goto Level '+this.nextLevel],
                    callbacks: ['gotoLevel'],
                    events: [this.nextLevel]});
                }else{
                    this.go('gotoLevel', this.nextLevel);
                }
            }
            return entities;
        }else if(tileType & G_TILE_TYPE.WAYPOINT){
            hero.setLastWayPoint(me.currentLevel);
            this.terrain[hp] = G_FLOOR.WAYPOINT;
            this.go('showInfo', {
                info: 'A waypoint to travel back to town '+this.currentLevel,
                labels: ['Travel to town', 'Stay'],
                callbacks: ['teleport', null],
                events:[0, null]});
        }else if(tileType & G_TILE_TYPE.PORTAL){
            var
            info = 'Town Portal, linked to waypoint at underground and portal open by teleport scroll',
            labels = [],
            callbacks = [],
            events = [],
            lastWayPoint = hero.getLastWayPoint(),
            lastPortal = hero.getLastPortal();

            if (lastWayPoint){
                labels.push('Waypoint (level '+lastWayPoint+')');
                callbacks.push('teleport');
                events.push(lastWayPoint);
            }

            if (lastPortal){
                labels.push('Portal (level '+lastPortal+')');
                callbacks.push('teleport');
                events.push(lastPortal);
            }

            if (!labels.length) return;

            this.go('showInfo', {
                info: info,
                labels: labels,
                callbacks: callbacks,
                events: events});
        }
    };

    me.lockInputs = function(up, down, move, out, twice){
        fingerStack.push([
            me.getRoute('fingerUp'),
            me.getRoute('fingerDown'),
            me.getRoute('fingerMove'),
            me.getRoute('fingerOut'),
            me.getRoute('fingerTwice')]);
        me.route('fingerUp', up || []);
        me.route('fingerDown', down || []);
        me.route('fingerMove', move || []);
        me.route('fingerOut', out || []);
        me.route('fingerTwice', twice || []);
    };

    me.routeInputs = function(up, down, move, out, twice){
        if (!fingerStack.length) return console.warn('routeInputs without lockInputs');
        me.route('fingerUp', up || []);
        me.route('fingerDown', down || []);
        me.route('fingerMove', move || []);
        me.route('fingerOut', out || []);
        me.route('fingerTwice', twice || []);
    };

    me.unlockInputs = function(){
        var f = fingerStack.pop();
        me.route('fingerUp', f[0]);
        me.route('fingerDown', f[1]);
        me.route('fingerMove', f[2]);
        me.route('fingerOut', f[3]);
        me.route('fingerTwice', f[4]);
    };

    me.branchFingerDown = function(elapsed, evt, entities){
        this.go(('camera' === entities[0].name) ? 'moveCameraStart' : 'scrollWinStart', evt);
    };

    me.branchFingerMove = function(elapsed, evt, entities){
        this.go(('camera' === entities[0].name) ? 'moveCamera' : 'scrollWin', evt);
    };

    me.branchFingerOut = function(elapsed, evt, entities){
        this.go(('camera' === entities[0].name) ? 'moveCameraEnd' : 'scrollWinEnd', evt);
    };
});
