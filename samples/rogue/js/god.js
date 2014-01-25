pico.def('god', 'picUIContent', function(){
    var
    Floor = Math.floor, Ceil = Math.ceil, Random = Math.random, Round = Math.round,
    me = this,
    name = me.moduleName,
    labels = [G_LABEL.OFFER, G_LABEL.TITHE, G_LABEL.LEAVE],
    isAltarOpened = false,
    heroBody,
    heroName,
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
        com = ent.getComponent(name),
        ts = tss['default'],
        i = ui.userData.id,
        x=rect[0], y=rect[1], w=rect[2], h=rect[3];

        switch(i){
        case 'offer':
            me.drawButton(ctx, rect, labels[0], '#d7e894', '#204631');
            break;
        case 'donate':
            me.drawButton(ctx, rect, labels[1], '#d7e894', '#204631');
            break;
        case 'done':
            me.drawButton(ctx, rect, labels[2], '#d7e894', '#204631');
            break;
        }
    },
    onCustomButton = function(ent, ctx, rect, ui, tss, scale){
        switch(ui.userData.id){
        case 'offer':
            me.drawButton(ctx, rect, labels[0], '#204631', '#d7e894', '#aec440', 'top');
            break;
        case 'donate':
            me.drawButton(ctx, rect, labels[1], '#204631', '#d7e894', '#aec440', 'top');
            break;
        case 'done':
            me.drawButton(ctx, rect, labels[2], '#204631', '#d7e894', '#aec440', 'top');
            break;
        }
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
            this.go('hideAltar');
            return true;
        }

        return false;
    },
    onCustomUI = function(){
        switch(Array.prototype.shift.call(arguments)){
        case me.CUSTOM_BOUND: return onCustomBound.apply(this, arguments); break;
        case me.CUSTOM_DRAW: return onCustomDraw.apply(this, arguments); break;
        case me.CUSTOM_CLICK: return onCustomClick.apply(this, arguments); break;
        case me.CUSTOM_BUTTON: return onCustomButton.apply(this, arguments); break;
        }
    };

    me.init = function(name){
        var h = this.heaven;
        if (h){
            heroBody = h[0];
            heroName = h[1];
        }else{
            h = [null, name];
        }
        if (name) heroName = name; // always get new from loginPage
        return h;
    };

    me.exit = function(){
        this.heaven = [heroBody, heroName];
    };

    me.step = function(steps){
    };

    me.show = function(ent, com, evt){
        if (undefined === evt) return;
        isAltarOpened = true;
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

        com.layout = me.createMeshUIFromTemplate(com.meshUI, width, height);

        return [com.layout.w, com.layout.h];
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
            // helm, armor, main hand, off hand, ring1, ring2, amulet, quiver, gold, skull, enemy, portal, way point, bag cap, spell cap
            appearance: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 8],
            stats: stats,
            effects: [],
            bag: [],
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

    me.toHeaven = function(appearance, stats){
        appearance[HERO_ENEMIES] = [];
        heroBody = [appearance, stats];
    };
});
