pico.def('game', 'pigSqrMap', function(){
    this.use('god');
    this.use('hero');
    this.use('ai');

    var
    me = this,
    db = window.localStorage,
    fingerStack = [],
    Max = Math.max,Abs = Math.abs,Floor = Math.floor,Random = Math.random,Pow = Math.pow,Sqrt = Math.sqrt,
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
        
        me.hero.move(undefined); // reinit hero pos to prevent hero.move deletes object at old map hero pos

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
        if (i < 0 || !(map[i] & G_TILE_TYPE.HIDE)) return count;
console.log(i);
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
        OBJ = G_TOWN_MAP.objects;

        objects.length = 0;
        hints.length = 0;
        flags.length = 0;
        
        for(var i=0,l=OBJ.length; i<l; i++){
            if (OBJ[i]){
                objects[i] = G_CREATE_OBJECT(OBJ[i]);
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
        terrain[c] = me.deepestLevel < me.currentLevel ? G_FLOOR.LOCKED : me.prevLevel < me.currentLevel ? G_FLOOR.STAIR_DOWN : G_FLOOR.STAIR_UP;

        if (!(me.currentLevel % 1)){
            c = shuffle.splice(Floor(Random()*shuffle.length), 1)[0];
            map[c] |= G_TILE_TYPE.WAYPOINT;
            terrain[c] = me.hero.getLastWayPoint() >= me.currentLevel ? G_FLOOR.WAYPOINT : G_FLOOR.WAYPOINT_NEW;
        }

        c = shuffle.splice(Floor(Random()*shuffle.length), 1)[0];
        terrain[c] = me.prevLevel < me.currentLevel ? G_FLOOR.STAIR_UP : G_FLOOR.STAIR_DOWN;
        hero.move(c);

console.log(JSON.stringify(hints));
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

    me.load = function(){
        loadGame();
        return me.heaven ? me.heaven[1] : undefined;
    };

    me.init = function(name){
        me.heaven = me.god.init.call(me, name);
        me.mortal = me.hero.init.call(me);

        if (!me.map.length)
            createLevel(me.currentLevel);

        me.objects = me.ai.init.call(me);
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
        events: [evt, undefined]});

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

    me.attackAnim = function(elapsed, evt, entities){
        var
        hero = this.hero,
        isSpell = evt[0],
        targetIds = evt[1],
        attackMsg = evt[2];

        if (!attackMsg) return;

        me.go('showInfo', { info: attackMsg } );

        if (!targetIds || !targetIds.length){
            me.go('counter', me.ai.battle());

            // for spell, reveal level is set at hero.castSpell
            if (!isSpell){
                var
                flags = me.flags,
                engagedIds = hero.getEngaged();
                
                for(var i=0,l=engagedIds.length; i<l; i++){
                    delete flags[engagedIds[i]]; // must do it after ai.battle to avoid flag creep attacks
                }
            }
            return;
        }

        me.lockInputs();

        if (!isSpell){
            var
            targetId = targetIds.pop(),
            objects = this.objects,
            pos = hero.getPosition(),
            creep = objects[targetId];

            hero.move(targetId);
        }

        setTimeout(function(){
            if(isSpell){
                me.go('startEffect', {type:'damageEfx',targets:targetIds.slice()});
                targetIds.length = 0;
            }else{
                hero.move(pos); // hero must move first
                objects[targetId] = creep;
                me.go('startEffect', {type:'damageEfx',targets:[targetId]});
            }

            me.routeInputs([function(){
                me.unlockInputs();
                me.go('attack', evt);
            }]);
        }, 500);

        return entities;
    };

    me.counterAnim = function(elapsed, evt, entities){
        var
        hero = me.hero,
        ai = me.ai,
        targetIds = evt[0],
        msgs = evt[1];

        if (!targetIds.length){
            var engagedIds = hero.getEngaged();
            
            for(var i=0,l=engagedIds.length; i<l; i++){
                ai.bury(engagedIds[i]);
            }

            engagedIds = hero.getEngaged();
            me.go('forceRefresh');
            if (engagedIds.length)
                me.go('showInfo', { targetId:engagedIds[0], context:G_CONTEXT.WORLD});
            return;
        }

        var
        targetId = targetIds.pop(),
        msg = msgs.pop();

        if (!hero.isEngaged(targetId) || !msg){
            this.go('counter', evt);
            return;
        }

        var
        objects = this.objects,
        pos = hero.getPosition(),
        creep = objects[targetId];

        me.lockInputs();

        me.go('showInfo', {info: msg});

        objects[targetId] = undefined;
        objects[pos] = creep;
        setTimeout(function(){
            me.go('forceRefresh');
            objects[targetId] = creep;
            hero.move(pos);
            me.ai.bury(targetId);
            me.go('startEffect', {type:'damageEfx',targets:[pos] });

            if (hero.isDead()){
                objects[pos] = G_CREATE_OBJECT(G_ICON.BONES),
                me.hero.bury(me.god);
                me.routeInputs([function(){
                    me.go('hideInfo');
                    me.go('showDialog', {
                        info: [
                            'RIP',
                            'you were killed by '+creep[OBJECT_NAME]+' at level '+me.currentLevel,
                            'but your lineage will continue...'],
                        callbacks: ['showAltar'],
                        events: ['true']});
                    me.unlockInputs();
                }]);
            }else{
                me.routeInputs([function(){
                    me.go('counter', evt);
                    me.unlockInputs();
                }]);
            }
        }, 500);
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

    me.gotoLevel = function(elapsed, level, entities){
        me.objects = me.ai.init.call(me);

        createLevel(level);

        me.go('resize', [0, 0, window.innerWidth, window.innerHeight]);
        return entities;
    };

    me.teleport = function(elapsed, level, entities){
        if (!this.currentLevel) me.hero.setLastPortal(0); // reset teleport level regardless of beam down or teleport down
        var ret = me.gotoLevel(elapsed, level, entities);
        this.prevLevel = this.prevLevel < level ? level - 1 : level + 1;
        return ret;
    };

    me.reborn = function(elapsed, evt, entities){
        me.deepestLevel = 0;
        me.mortal = undefined;
        me.mortal = me.hero.init.call(me);

        createLevel(0);

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
                hero.putIntoTome(me.ai.studyScroll(hero.getJob(), hero.getWill(), this.currentLevel));
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
                if (this.currentLevel){
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
