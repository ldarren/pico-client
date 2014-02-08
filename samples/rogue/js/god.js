pico.def('god', 'picUIContent', function(){
    var
    Floor = Math.floor, Ceil = Math.ceil, Random = Math.random, Round = Math.round,
    me = this,
    name = me.moduleName,
    labels = [G_LABEL.OFFER, G_LABEL.TITHE, G_LABEL.LEAVE],
    isAltarOpened = false,
    callback,
    heroBody, heroName, heroPiety,
    onCustomBound = function(ent, rect, ui, scale){
        switch(ui.userData.id){
        case 'offer':
        case 'donate':
        case 'done':
            return me.calcUIRect(rect, ui);
        }
        return me.calcUIRect(rect, ui, scale);
    },
    onCustomDraw = function(ent, ctx, rect, ui, tss, scale){
        var
        hero = this.hero,
        mortal = this.mortal,
        appearance = mortal.appearance,
        stats = mortal.stats,
        ts = tss['default'],
        id = ui.userData.id;

        switch(id){
        case 'piety':
            me.fillIconText(ctx, ts, 'You have '+heroPiety+' `'+G_UI.PIETY+' piety points', rect, scale);
            break;
        case 'offer':
            me.drawButton(ctx, ts, labels[0], rect, scale, G_COLOR_TONE[0], G_COLOR_TONE[3]);
            break;
        case 'donate':
            me.drawButton(ctx, ts, labels[1], rect, scale, G_COLOR_TONE[0], G_COLOR_TONE[3]);
            break;
        case 'done':
            me.drawButton(ctx, ts, labels[2], rect, scale, G_COLOR_TONE[0], G_COLOR_TONE[3]);
            break;
        case 'avatar':
            me.drawButton(ctx, ts, '`'+stats[OBJECT_ICON], rect, scale, G_COLOR_TONE[0], G_COLOR_TONE[2]);
            break;
        case 'helm':
        case 'armor':
        case 'main':
        case 'off':
        case 'ringL':
        case 'ringR':
        case 'amulet':
        case 'quiver':
            var
            equipId = hero.convertEquipId(id),
            slot = appearance[equipId],
            item = slot[0];
            if (item) me.drawButton(ctx, ts, '`'+item[OBJECT_ICON], rect, scale, G_COLOR_TONE[0], G_COLOR_TONE[2]);
            else me.drawButton(ctx, ts, 'Add '+G_EQUIP_NAME[equipId], rect, scale, G_COLOR_TONE[0], G_COLOR_TONE[2]);
            break;
        }
    },
    onCustomButton = function(ent, ctx, rect, ui, tss, scale){
        var
        hero = this.hero,
        mortal = this.mortal,
        appearance = mortal.appearance,
        stats = mortal.stats,
        ts = tss['default'],
        id = ui.userData.id,
        label;

        switch(id){
        case 'offer':
            label = labels[0];
            break;
        case 'donate':
            label = labels[1];
            break;
        case 'done':
            label = labels[2];
            break;
        case 'avatar':
            label = '`'+stats[OBJECT_ICON];
            break;
        case 'helm':
        case 'armor':
        case 'main':
        case 'off':
        case 'ringL':
        case 'ringR':
        case 'amulet':
        case 'quiver':
            var
            equipId = hero.convertEquipId(id),
            slot = appearance[equipId],
            item = slot[0];

            if (item) label = '`'+item[OBJECT_ICON];
            else label = 'Add '+G_EQUIP_NAME[equipId];
            break;
        }
        me.drawButton(ctx, ts, label, rect, scale, G_COLOR_TONE[3], G_COLOR_TONE[0], G_COLOR_TONE[1], 3);
    },
    onCustomClick = function(ent, ui){
        if (!ui){
            return false;
        }
        var
        com = ent.getComponent(name),
        i = ui.userData.id;

        switch(i){
        case 'offer':
            return true;
        case 'donate':
            return true;
        case 'done':
            isAltarOpened = false;
            this.go(callback);
            this.go('hideAltar');
            return true;
        }

        return false;
    },
    onCustomUI = function(){
        switch(Array.prototype.shift.call(arguments)){
        case me.CUSTOM_BOUND: return onCustomBound.apply(this, arguments);
        case me.CUSTOM_DRAW: return onCustomDraw.apply(this, arguments);
        case me.CUSTOM_CLICK: return onCustomClick.apply(this, arguments);
        case me.CUSTOM_BUTTON: return onCustomButton.apply(this, arguments);
        }
    };

    me.init = function(name){
        var h = this.heaven;
        if (h){
            heroBody = h[0];
            heroName = h[1];
            heroPiety = h[2];
        }else{
            h = [null, name, 0];
            heroPiety = 0;
        }
        if (name) heroName = name; // always get new from loginPage
        return h;
    };

    me.exit = function(){
        this.heaven = [heroBody, heroName, heroPiety];
    };

    me.step = function(steps){
    };

    me.create = function(ent, data){
        data = me.base.create.call(this, ent, data);

        data.font = this.smallDevice ? data.fontSmall : data.fontBig;
        return data;
    };

    me.show = function(ent, com, evt){
        if (undefined === evt) return;
        callback = evt.callback;
        isAltarOpened = true;
        if (!this.mortal) this.mortal = me.createHero();
    };

    me.hide = function(ent, com, evt){
        if (undefined === evt) return;
    };

    me.isValid = function(){
        return isAltarOpened;
    };

    me.resize = function(ent, width, height){
        var
        com = ent.getComponent(name),
        comWin = ent.getComponent(com.win);
        layout = me.createMeshUIFromTemplate(com.meshUI, width, height),
        rows = layout.rows,
        opt = rows[0];

        opt.font = com.font;

        com.layout = layout;

        return [layout.w, layout.h];
    };

    me.click = function(ent, x, y, state){
        var
        com = ent.getComponent(name),
        comBox = ent.getComponent(com.box),
        scale = this.smallDevice ? 1 : 2;

        return me.clickMeshUI.call(this, x, y, state, ent, com, comBox, scale, onCustomUI);
    };

    me.draw = function(ctx, ent, clip){
        var
        com = ent.getComponent(name),
        comBox = ent.getComponent(com.box),
        scale = this.smallDevice ? 1 : 2;

        return me.drawMeshUI.call(this, ctx, {default: this.tileSet}, ent, com, comBox, scale, onCustomUI);
    };
    
    me.createHero = function(){
        var
        job = Round(G_ICON.ROGUE + Random()*(G_ICON.WARLOCK-G_ICON.ROGUE)),
        stats = G_CREATE_OBJECT(job, heroName);

        return {
            // helm, armor, main hand, off hand, ring1, ring2, amulet, quiver, gold, piety, enemy, portal, way point, bag cap, spell cap
            appearance: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 8],
            stats: stats,
            effects: [],
            bag: [[G_CREATE_OBJECT(G_ICON.CLAYMORE),1,0]],
            tome: [
                G_CREATE_OBJECT(G_ICON.GAZE),
                G_CREATE_OBJECT(G_ICON.FIREBALL),
                G_CREATE_OBJECT(G_ICON.POISON_BLADE),
                G_CREATE_OBJECT(G_ICON.WHIRLWIND)]
        };
    };

    me.getTomb = function(level){
        if (!heroBody) return;
        var
        appearance = heroBody[0],
        stats = heroBody[1];

        if (stats[OBJECT_LEVEL] !== level) return;

        var
        tomb = G_CREATE_OBJECT(G_ICON.TOMB, stats[OBJECT_NAME]+' '+G_OBJECT_NAME[G_ICON.TOMB]),
        remain = Round(Random()*HERO_AMULET);

        for(var i=0,l=HERO_QUIVER; i<l; i++){
            if (remain === i) continue;
            delete appearance[i];
        }

        tomb[TOMB_BODY] = appearance;
        heroBody = undefined;
        return tomb; 
    };

    me.offering = function(){
    };

    me.getPiety = function(){ return heroPiety; };
    me.incrPiety = function(piety){ heroPiety += piety; };

    me.toHeaven = function(appearance, stats){
        appearance[HERO_ENEMIES] = [];
        heroBody = [appearance, stats];
    };
});
