pico.def('hero', 'picUIWindow', function(){
    this.use('god');

    var
    me = this,
    name = me.moduleName,
    Floor = Math.floor, Ceil = Math.ceil, Random = Math.random,
    objects,
    position,
    selectedSpell,
    heroObj,
    appearance,
    stats,
    effects,
    bag,
    tome,
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
        x = rect.x + gs + margin,
        y = rect.y + gs + margin,
        uiSize = sd ? 8 : 16,
        uiSize2 = uiSize/2,
        textWidth3 = sd ? 20 : 30,
        textWidth2 = sd ? 20 : 30,
        center = y + uiSize2,
        i, l;

        ctx.save();
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.font = com.font;
        ctx.fillStyle = com.fontColor;

        ctx.fillText(G_OBJECT_NAME[job], x, center, rect.width);

        x = rect.x + gs + margin;
        y += uiSize*2;
        uiSize = sd ? 8 : 16;
        
        // draw hp
        for(i=0, l=stats[0]; i<l; i++){
            ts.draw(ctx, G_UI.HP, x, y, uiSize, uiSize);
            x += uiSize;
        }

        x = rect.x + gs + margin + pw;
        y = rect.y + gs + margin;
        uiSize = sd ? 16 : 32;
        uiSize2 = uiSize/2,
        center = y + uiSize2;

        x = drawData(ctx, ts, G_UI.LEVEL, this.deepestLevel, x, y, center, uiSize, margin, textWidth3);
        x = drawData(ctx, ts, G_UI.DEX, stats[2], x, y, center, uiSize, margin, textWidth3);
        x = drawData(ctx, ts, G_UI.LUCK, stats[3], x, y, center, uiSize, margin, textWidth3);

        x = rect.x + gs + margin + pw;
        y += uiSize;
        center = y + uiSize2;

        x = drawData(ctx, ts, G_UI.GOLD, appearance[8], x, y, center, uiSize, margin, textWidth2);
        x = drawData(ctx, ts, G_UI.SKULL, appearance[9], x, y, center, uiSize, margin, textWidth2);

        x = rect.x + gs + margin + pw*2;
        y = rect.y + gs + margin;
        center = y + uiSize2;
        
        x = drawData(ctx, ts, G_UI.PATK, stats[4], x, y, center, uiSize, margin, textWidth3);
        x = drawData(ctx, ts, G_UI.RATK, stats[5], x, y, center, uiSize, margin, textWidth3);
        x = drawData(ctx, ts, G_UI.MATK, stats[6], x, y, center, uiSize, margin, textWidth3);

        x = rect.x + gs + margin + pw*2;
        y += uiSize;
        center = y + uiSize2;

        x = drawData(ctx, ts, G_UI.PDEF, stats[7], x, y, center, uiSize, margin, textWidth3);
        x = drawData(ctx, ts, G_UI.MDEF, stats[8], x, y, center, uiSize, margin, textWidth3);
        x = drawData(ctx, ts, G_UI.WILL, stats[1], x, y, center, uiSize, margin, textWidth3);

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

    me.init = function(objs, mortal, index){
        heroObj = mortal;
        if (!heroObj){
            heroObj = me.god.createHero();
        }
        objects = objs;
        position = index;
        appearance = heroObj.appearance;
        stats = heroObj.stats;
        effects = heroObj.effects;
        bag = heroObj.bag;
        tome = heroObj.tome;

        return heroObj;
    };

    me.exit = function(){
    };

    me.explore = function(){
    };

    me.attack = function(){
    };

    me.move = function(index){
        delete objects[position];
        position = index;
        objects[index] = appearance[0];
    };

    me.selectSpell = function(spell){ selectedSpell = spell; };
    me.getSelectedSpell = function(){ return selectedSpell; };
    me.getPosition = function(){ return position; };
    me.getJob = function(){ return appearance[0]; };
    me.getBag = function(){ return bag; };
    me.getTome = function(){ return tome; };

    me.reborn = function(){
    };

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
