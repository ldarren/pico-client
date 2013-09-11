pico.def('hero', 'picUIWindow', function(){
    var
    me = this,
    name = me.moduleName,
    Floor = Math.floor, Ceil = Math.ceil, Round = Math.round, Random = Math.random,
    ATTACK_WIN = "You rolled a TOTAL(ROLL+ATK) beat NAME's defense DEF, you've dealt DMG damage",
    ATTACK_LOST = "You missed by rolling a TOTAL(ROLL+ATK) lowered than NAME's defense DEF",
    COUNTER_WIN = "NAME has rolled a TOTAL(ROLL+ATK) which is over your defense DEF, you lost HP hp",
    COUNTER_LOST = "NAME missed by rolling a TOTAL(ROLL+ATK) less than your defense DEF",
    CREEP_KILL = ", and you have defeated NAME",
    HERO_KILL = ", and you have been killed by NAME",
    FLEE_WIN = "You rolled a TOTAL(ROLL+DEX) beat NAME's attack ATK, you fleed the scene",
    FLEE_LOST = "You failed to flee by rolling a TOTAL(ROLL+DEX) lower than NAME's attack ATK, you lost HP hp",
    objects, flags,
    position, level, selectedSpell, targetId,
    heroObj,
    appearance, stats, effects, bag, tome,
    currStats,
    d20Roll = function(){
        return Round(Random()*21);
    },
    drawSmall = function(ctx, win, com, rect){
        var
        ts = this.tileSet,
        tw = this.tileWidth,
        th = this.tileHeight,
        sd = this.smallDevice,
        gs = win.gridSize,
        margin = sd ? 2 : 4,
        pw = (rect.width - gs*2 - margin*2)/3,
        textWidth3 = sd ? 15 : 30,
        textWidth2 = sd ? 20 : 50,
        x = rect.x + gs + margin,
        y = rect.y + gs + margin,
        uiSize = sd ? 16 : 32,
        i, l;

        ctx.save();
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.font = com.font;
        ctx.fillStyle = com.fontColor;

        ctx.fillText(currStats[OBJECT_NAME], x, y + uiSize/2, rect.width);

        x = rect.x + gs + margin;
        y += uiSize;
        uiSize = sd ? 16 : 32;

        x = me.drawData(ctx, ts, G_UI.LEVEL, level, x, y, uiSize, margin, textWidth3);
        x = me.drawData(ctx, ts, G_UI.DEX, currStats[HERO_DEX], x, y, uiSize, margin, textWidth3);
        x = me.drawData(ctx, ts, G_UI.LUCK, currStats[HERO_LUCK], x, y, uiSize, margin, textWidth3);

        x = rect.x + gs + margin + pw;
        y = rect.y + gs + margin;
        uiSize = sd ? 8 : 16;
        
        // draw hp
        for(i=0, l=stats[2]; i<l; i++){
            ts.draw(ctx, (i < currStats[2]) ? G_UI.HP : G_UI.HP_EMPTY, x, y+margin, uiSize, uiSize);
            x += uiSize;
        }

        x = rect.x + gs + margin + pw;
        uiSize = sd ? 16 : 32;
        y += uiSize;

        x = me.drawData(ctx, ts, G_UI.GOLD, appearance[8], x, y, uiSize, margin, textWidth2);
        x = me.drawData(ctx, ts, G_UI.SKULL, appearance[9], x, y, uiSize, margin, textWidth2);

        x = rect.x + gs + margin + pw*2;
        y = rect.y + gs + margin;
        
        x = me.drawData(ctx, ts, G_UI.PATK, currStats[6], x, y, uiSize, margin, textWidth3);
        x = me.drawData(ctx, ts, G_UI.RATK, currStats[7], x, y, uiSize, margin, textWidth3);
        x = me.drawData(ctx, ts, G_UI.MATK, currStats[8], x, y, uiSize, margin, textWidth3);

        x = rect.x + gs + margin + pw*2;
        y += uiSize;

        x = me.drawData(ctx, ts, G_UI.PDEF, currStats[9], x, y, uiSize, margin, textWidth3);
        x = me.drawData(ctx, ts, G_UI.MDEF, currStats[10], x, y, uiSize, margin, textWidth3);
        x = me.drawData(ctx, ts, G_UI.WILL, currStats[3], x, y, uiSize, margin, textWidth3);

        ctx.restore();
    },
    drawBig = function(ctx, win, com, rect){
        var
        ts = this.tileSet,
        tw = this.tileWidth,
        th = this.tileHeight,
        job = this.hero.getJob(),
        gs = win.gridSize,
        x = rect.x + gs + 8,
        y = rect.y + gs + 8;

        ctx.save();
        ts.draw(ctx, job, x, y, tw, th);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.font = com.font;
        ctx.fillStyle = com.fontColor;
        ctx.fillText(G_OBJECT_NAME[job], x + tw/2, y + th, rect.width);
        ctx.restore();
    };

    me.create = function(ent, data){
        data.font = this.smallDevice ? data.fontSmall : data.fontBig;
        return data;
    };

    me.init = function(){
        heroObj = this.mortal;
        if (!heroObj){
            heroObj = this.god.createHero();
        }
        objects = this.objects;
        flags = this.flags;
        appearance = heroObj.appearance;
        stats = heroObj.stats;
        effects = heroObj.effects;
        bag = heroObj.bag;
        tome = heroObj.tome;
        target = appearance[10];

        if (target){
            this.go('showInfo', target);
        }
        level = 0;
        me.levelUp(this.deepestLevel);
        me.move(this.mortalLoc);

        return heroObj;
    };

    me.exit = function(){
    };

    me.step = function(steps){
        var spell;
        for(var i=0, l=tome.length; i<l; i++){
            spell = tome[i];
            if (spell[3]) {
                spell[3] -= steps;
                if (spell[3] < 0) spell[3] = 0;
            }
        }
    };

    me.battle = function(id, accident){
        me.setTargetId(id);
console.log('battle',arguments.callee.caller.name, id, objects[id]);
        var
        target = objects[id],
        flag = flags[id],
        creepName = G_OBJECT_NAME[target[0]],
        attack = accident ? undefined : [d20Roll(), currStats[6], target[7]],
        counter = flag || G_CREEP_TYPE.PLANT === target[2] ? undefined : [d20Roll(), target[4], currStats[9]],
        total, hit, attackMsg, counterMsg;

        if (attack){
            total = attack[0]+attack[1];
            hit = total > attack[2];

            attackMsg = (hit ? ATTACK_WIN : ATTACK_LOST)
            .replace('NAME', creepName)
            .replace('TOTAL', total)
            .replace('ROLL', attack[0])
            .replace('ATK', attack[1])
            .replace('DEF', attack[2])
            .replace('DMG', 1);

            if (hit) target[3]--;

            if (target[3] < 1){
                attackMsg += CREEP_KILL.replace('NAME', creepName);
            }
        }
        if (counter){
            total = counter[0]+counter[1];
            hit = total > counter[2];

            counterMsg = (hit ? COUNTER_WIN : COUNTER_LOST)
            .replace('NAME', creepName)
            .replace('TOTAL', total)
            .replace('ROLL', counter[0])
            .replace('ATK', counter[1])
            .replace('DEF', counter[2])
            .replace('HP', 1);

            if (hit) currStats[2]--;

            if (currStats[2] < 1){
                counterMsg += HERO_KILL.replace('NAME', creepName);
            }
        }

        delete flags[id];

        return [attackMsg, counterMsg];
    };

    me.flee = function(){
        if (!targetId) return false; // return error?

        var
        target = objects[targetId],
        roll = d20Roll(),
        total = roll + currStats[4];

        if (total > target[4]) {
            me.setTargetId(undefined);
            return [true, FLEE_WIN
                .replace('TOTAL', total)
                .replace('ROLL', roll)
                .replace('DEX', currStats[4])
                .replace('NAME', G_OBJECT_NAME[target[0]])
                .replace('ATK', target[4])];
        }
        return [false, FLEE_LOST
                .replace('TOTAL', total)
                .replace('ROLL', roll)
                .replace('DEX', currStats[4])
                .replace('NAME', G_OBJECT_NAME[target[0]])
                .replace('ATK', target[4])
                .replace('HP', 1)];
    }

    me.move = function(pos){
        delete objects[position];
        position = pos;
        objects[pos] = currStats;
    };

    me.reborn = function(){
    };

    me.levelUp = function(lvl){
        if (lvl < level) return currStats;
        level = lvl;
        currStats = stats.slice();
        for(var i=3; i<11; i++){
            currStats[i] = Ceil(currStats[i]*level);
        }
        return currStats;
    };

    me.castSpell = function(){
        var s = selectedSpell;
        if (!s || s[3]) return;

        selectedSpell = undefined;
        s[3] = s[2]; // set cooldown;

        return s; // TODO return spell effects instead
    };

    me.selectSpell = function(spell){
        if (spell && spell[3]) return;
        selectedSpell = spell;
    };

    me.getSelectedSpell = function(){ return selectedSpell; };
    me.getPosition = function(){ return position; };
    me.getJob = function(){ return appearance[0]; };
    me.getLuck = function(){ return currStats[5]; };
    me.getBag = function(){ return bag; };
    me.getTome = function(){ return tome; };
    me.incrHp = function(inc) { currStats[2] += inc; };
    me.equal = function(obj){ return obj[0] === currStats[0] && obj[1] === currStats[1]; };
    me.isTarget = function(id){ return targetId === id; };
    me.getTargetId = function(){ return targetId; };
    me.setTargetId = function(id){ return appearance[10] = targetId = id; };
    me.isDead = function(){ return currStats[2] < 1; };

    me.draw = function(ctx, ent, clip){
        var
        com = ent.getComponent(name),
        win = ent.getComponent(com.win),
        rect = ent.getComponent(win.box);

        if (win.maximized){
            return drawBig.call(this, ctx, win, com, rect);
        }else{
            return drawSmall.call(this, ctx, win, com, rect);
        }
    };
});
