pico.def('hero', 'picUIWindow', function(){
    var
    me = this,
    name = me.moduleName,
    Floor = Math.floor, Ceil = Math.ceil, Random = Math.random,
    objects,
    position, level, selectedSpell,
    heroObj,
    appearance, stats, effects, bag, tome,
    currStats,
    drawData = function(ctx, ts, icon, text, x, y, center, uiSize, margin, textWidth){
        ts.draw(ctx, icon, x, y, uiSize, uiSize);
        x += uiSize;
        if (textWidth){
            ctx.fillText(text, x, center, textWidth);
            x += textWidth;
        }else{
            ctx.fillText(text, x, center);
            var metrics = ctx.measureText(''+text);
            x += metrics.width + margin;
        }
        return x;
    },
    drawSmall = function(ctx, win, com, rect){
        var
        ts = this.tileSet,
        tw = this.tileWidth,
        th = this.tileHeight,
        job = this.hero.getJob(),
        sd = this.smallDevice,
        gs = win.gridSize,
        margin = sd ? 2 : 4,
        pw = (rect.width - gs*2 - margin*2)/3,
        textWidth3 = sd ? 15 : 30,
        textWidth2 = sd ? 15 : 30,
        x = rect.x + gs + margin,
        y = rect.y + gs + margin,
        uiSize = sd ? 16 : 32,
        uiSize2 = uiSize/2,
        center = y + uiSize2,
        i, l;

        ctx.save();
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.font = com.font;
        ctx.fillStyle = com.fontColor;

        ctx.fillText(G_OBJECT_NAME[job], x, center, rect.width);

        x = rect.x + gs + margin;
        y += uiSize;
        uiSize = sd ? 8 : 16;
        uiSize2 = uiSize/2;
        
        // draw hp
        for(i=0, l=currStats[1]; i<l; i++){
            ts.draw(ctx, G_UI.HP, x, y, uiSize, uiSize);
            x += uiSize;
        }

        x = rect.x + gs + margin + pw;
        y = rect.y + gs + margin;
        uiSize = sd ? 16 : 32;
        uiSize2 = uiSize/2,
        center = y + uiSize2;

        x = drawData(ctx, ts, G_UI.LEVEL, level, x, y, center, uiSize, margin, textWidth3);
        x = drawData(ctx, ts, G_UI.DEX, currStats[3], x, y, center, uiSize, margin, textWidth3);
        x = drawData(ctx, ts, G_UI.LUCK, currStats[4], x, y, center, uiSize, margin, textWidth3);

        x = rect.x + gs + margin + pw;
        y += uiSize;
        center = y + uiSize2;

        x = drawData(ctx, ts, G_UI.GOLD, appearance[8], x, y, center, uiSize, margin, textWidth2);
        x = drawData(ctx, ts, G_UI.SKULL, appearance[9], x, y, center, uiSize, margin, textWidth2);

        x = rect.x + gs + margin + pw*2;
        y = rect.y + gs + margin;
        center = y + uiSize2;
        
        x = drawData(ctx, ts, G_UI.PATK, currStats[5], x, y, center, uiSize, margin, textWidth3);
        x = drawData(ctx, ts, G_UI.RATK, currStats[6], x, y, center, uiSize, margin, textWidth3);
        x = drawData(ctx, ts, G_UI.MATK, currStats[7], x, y, center, uiSize, margin, textWidth3);

        x = rect.x + gs + margin + pw*2;
        y += uiSize;
        center = y + uiSize2;

        x = drawData(ctx, ts, G_UI.PDEF, currStats[8], x, y, center, uiSize, margin, textWidth3);
        x = drawData(ctx, ts, G_UI.MDEF, currStats[9], x, y, center, uiSize, margin, textWidth3);
        x = drawData(ctx, ts, G_UI.WILL, currStats[2], x, y, center, uiSize, margin, textWidth3);

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
        heroObj = this.heroObj;
        if (!heroObj){
            heroObj = this.god.createHero();
        }
        objects = this.objects;
        appearance = heroObj.appearance;
        stats = heroObj.stats;
        effects = heroObj.effects;
        bag = heroObj.bag;
        tome = heroObj.tome;

        me.levelUp(this.deepestLevel);
        me.move(this.mortalLoc);

        return heroObj;
    };

    me.exit = function(){
    };

    me.step = function(){
        var spell
        for(var i=0, l=tome.length; i<l; i++){
            spell = tome[i];
            if (spell[3]) spell[3]--;
        }
    };

    me.attack = function(object){
    };

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
        for(var i=2; i<10; i++){
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
    me.getBag = function(){ return bag; };
    me.getTome = function(){ return tome; };

    me.draw = function(ctx, ent, clip){
        var
        com = ent.getComponent(name),
        win = ent.getComponent(com.win),
        rect = ent.getComponent(win.box);

        if (rect.height > (this.tileWidth * 3)){
            return drawBig.call(this, ctx, win, com, rect);
        }else{
            return drawSmall.call(this, ctx, win, com, rect);
        }
    };
});
