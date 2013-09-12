pico.def('hero', 'picUIWindow', function(){
    var
    me = this,
    name = me.moduleName,
    Floor = Math.floor, Ceil = Math.ceil, Round = Math.round, Random = Math.random,
    objects, flags,
    position, selectedSpell, targetId,
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

        x = me.drawData(ctx, ts, G_UI.LEVEL, currStats[OBJECT_LEVEL], x, y, uiSize, margin, textWidth3);
        x = me.drawData(ctx, ts, G_UI.DEX, currStats[OBJECT_DEX], x, y, uiSize, margin, textWidth3);
        x = me.drawData(ctx, ts, G_UI.LUCK, currStats[OBJECT_LUCK], x, y, uiSize, margin, textWidth3);

        x = rect.x + gs + margin + pw;
        y = rect.y + gs + margin;
        uiSize = sd ? 8 : 16;
        
        // draw hp
        for(i=0, l=stats[OBJECT_HP]; i<l; i++){
            ts.draw(ctx, (i < currStats[OBJECT_HP]) ? G_UI.HP : G_UI.HP_EMPTY, x, y+margin, uiSize, uiSize);
            x += uiSize;
        }

        x = rect.x + gs + margin + pw;
        uiSize = sd ? 16 : 32;
        y += uiSize;

        x = me.drawData(ctx, ts, G_UI.GOLD, appearance[HERO_GOLD], x, y, uiSize, margin, textWidth2);
        x = me.drawData(ctx, ts, G_UI.SKULL, appearance[HERO_SKULL], x, y, uiSize, margin, textWidth2);

        x = rect.x + gs + margin + pw*2;
        y = rect.y + gs + margin;
        
        x = me.drawData(ctx, ts, G_UI.PATK, currStats[OBJECT_ATK], x, y, uiSize, margin, textWidth3);
        x = me.drawData(ctx, ts, G_UI.RATK, currStats[OBJECT_RATK], x, y, uiSize, margin, textWidth3);
        x = me.drawData(ctx, ts, G_UI.MATK, currStats[OBJECT_MATK], x, y, uiSize, margin, textWidth3);

        x = rect.x + gs + margin + pw*2;
        y += uiSize;

        x = me.drawData(ctx, ts, G_UI.PDEF, currStats[OBJECT_DEF], x, y, uiSize, margin, textWidth3);
        x = me.drawData(ctx, ts, G_UI.MDEF, currStats[OBJECT_MDEF], x, y, uiSize, margin, textWidth3);
        x = me.drawData(ctx, ts, G_UI.WILL, currStats[OBJECT_WILL], x, y, uiSize, margin, textWidth3);

        ctx.restore();
    },
    drawBig = function(ctx, win, com, rect){
        var
        ts = this.tileSet,
        tw = this.tileWidth,
        th = this.tileHeight,
        gs = win.gridSize,
        x = rect.x + gs + 8,
        y = rect.y + gs + 8;

        ctx.save();
        ts.draw(ctx, currStats[OBJECT_ICON], x, y, tw, th);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.font = com.font;
        ctx.fillStyle = com.fontColor;
        ctx.fillText(currStats[OBJECT_NAME], x + tw/2, y + th, rect.width);
        ctx.restore();
    };

    me.create = function(ent, data){
        data.font = this.smallDevice ? data.fontSmall : data.fontBig;
        return data;
    };

    me.init = function(){
        heroObj = this.mortal;
        if (!heroObj){
            heroObj = this.god.createHero('Sir John Fenwick of Wallington');
        }
        objects = this.objects;
        flags = this.flags;
        appearance = heroObj.appearance;
        stats = heroObj.stats;
        effects = heroObj.effects;
        bag = heroObj.bag;
        tome = heroObj.tome;
        target = appearance[HERO_ENEMY];

        if (target){
            this.go('showInfo', {targetId: target});
        }
        currStats = []; // level up will update currStats
        me.levelUp(this.deepestLevel);
        me.move(this.mortalLoc);

        return heroObj;
    };

    me.exit = function(){
    };

    me.step = function(steps){
        var spell, cooldown;
        for(var i=0, l=tome.length; i<l; i++){
            spell = tome[i];
            cooldown = spell[SPELL_COOLDOWN];
            if (cooldown) {
                cooldown -= steps;
                if (cooldown < 0) cooldown = 0;
            }
            spell[SPELL_COOLDOWN] = cooldown;
        }
    };

    me.battle = function(id, accident){
        me.setTargetId(id);

        var
        target = objects[id],
        flag = flags[id],
        creepName = target[OBJECT_NAME],
        attack = accident ? undefined : [d20Roll(), currStats[OBJECT_ATK], target[CREEP_DEF]],
        counter = flag || G_CREEP_TYPE.PLANT === target[OBJECT_SUB_TYPE] ? undefined : [d20Roll(), target[CREEP_ATK], currStats[OBJECT_DEF]],
        total, hit, attackMsg, counterMsg;

        if (attack){
            total = attack[0]+attack[1];
            hit = total > attack[2];

            attackMsg = (hit ? MSG_ATTACK_WIN : MSG_ATTACK_LOST)
            .replace('NAME', creepName)
            .replace('TOTAL', total)
            .replace('ROLL', attack[0])
            .replace('ATK', attack[1])
            .replace('DEF', attack[2])
            .replace('DMG', 1);

            if (hit) target[CREEP_HP]--;

            if (target[CREEP_HP] < 1){
                attackMsg += MSG_CREEP_KILL.replace('NAME', creepName);
            }
        }
        if (counter){
            total = counter[0]+counter[1];
            hit = total > counter[2];

            counterMsg = (hit ? MSG_COUNTER_WIN : MSG_COUNTER_LOST)
            .replace('NAME', creepName)
            .replace('TOTAL', total)
            .replace('ROLL', counter[0])
            .replace('ATK', counter[1])
            .replace('DEF', counter[2])
            .replace('HP', 1);

            if (hit) currStats[OBJECT_HP]--;

            if (currStats[OBJECT_HP] < 1){
                counterMsg += MSG_HERO_KILL.replace('NAME', creepName);
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
        total = roll + currStats[OBJECT_DEX];

        if (total > target[CREEP_ATK]) {
            me.setTargetId(undefined);
            return [true, MSG_FLEE_WIN
                .replace('TOTAL', total)
                .replace('ROLL', roll)
                .replace('DEX', currStats[OBJECT_DEX])
                .replace('NAME', target[OBJECT_NAME])
                .replace('ATK', target[CREEP_ATK])];
        }
        return [false, MSG_FLEE_LOST
                .replace('TOTAL', total)
                .replace('ROLL', roll)
                .replace('DEX', currStats[OBJECT_DEX])
                .replace('NAME', target[OBJECT_NAME])
                .replace('ATK', target[CREEP_ATK])
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
        if (currStats[OBJECT_LEVEL] > lvl) return currStats;
        currStats = stats.slice();
        for(var i=OBJECT_WILL; i<OBJECT_VEG; i++){
            currStats[i] = Ceil(currStats[i]*lvl);
        }
        currStats[OBJECT_LEVEL] = lvl;
        return currStats;
    };

    me.castSpell = function(){
        var s = selectedSpell;
        if (!s || s[SPELL_COOLDOWN]) return;

        selectedSpell = undefined;
        s[SPELL_COOLDOWN] = s[SPELL_RELOAD]; // set cooldown;

        return s; // TODO return spell effects instead
    };

    me.selectSpell = function(spell){
        if (spell && spell[SPELL_COOLDOWN]) return;
        selectedSpell = spell;
    };

    me.incrHp = function(inc) {
        var hp = currStats[OBJECT_HP];
        hp += inc;
        if (hp > stats[OBJECT_HP]) hp = stats[OBJECT_HP];
        currStats[OBJECT_HP] = hp;
    };

    me.getSelectedSpell = function(){ return selectedSpell; };
    me.getPosition = function(){ return position; };
    me.getJob = function(){ return currStats[OBJECT_TYPE]; };
    me.getLuck = function(){ return currStats[OBJECT_LUCK]; };
    me.getBag = function(){ return bag; };
    me.getTome = function(){ return tome; };
    me.equal = function(obj){ return obj[OBJECT_ICON] === currStats[OBJECT_ICON] && obj[OBJECT_TYPE] === currStats[OBJECT_TYPE]; };
    me.isTarget = function(id){ return targetId === id; };
    me.getTargetId = function(){ return targetId; };
    me.setTargetId = function(id){ return appearance[HERO_ENEMY] = targetId = id; };
    me.isDead = function(){ return currStats[OBJECT_HP] < 1; };

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
