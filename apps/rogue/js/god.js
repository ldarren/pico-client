inherit('pico/picUIContent');

var hero = require('hero');
var ai = require('ai');
var trade = require('trade');
var tome = require('tome');

var
Floor = Math.floor, Ceil = Math.ceil, Random = Math.random, Round = Math.round, Max = Math.max,
name = me.moduleName,
FORGE_COST = 100,
heroClasses = [
    [G_OBJECT[G_ICON.ROGUE], 1],
    [G_OBJECT[G_ICON.MONK], 1],
    [G_OBJECT[G_ICON.BARBARIAN], 1],
    [G_OBJECT[G_ICON.DRUID], 1],
    [G_OBJECT[G_ICON.HUNTER], 1],
    [G_OBJECT[G_ICON.PALADIN], 1],
    [G_OBJECT[G_ICON.WIZARD], 1],
    [G_OBJECT[G_ICON.WARLOCK], 1],
],
labels = [G_LABEL.OFFER, G_LABEL.TITHE, G_LABEL.CLOSE],
isAltarOpened = false,
callback,
heroBody, heroName, heroPiety,heroProgress={},
onCustomBound = function(ent, rect, ui, scale){
    switch(ui.userData.id){
    case 'donate':
    case 'tithe':
    case 'done':
        return me.calcUIRect(rect, ui);
    }
    return me.calcUIRect(rect, ui, scale);
},
onCustomDraw = function(ent, ctx, rect, ui, tss, scale){
    var
    mortal = this.mortal,
    appearance = mortal.appearance,
    stats = mortal.stats,
    id = ui.userData.id;

    switch(id){
    case 'piety':
        me.fillIconText(ctx, tss, 'You have '+heroPiety+' `0'+G_UI.PIETY+' piety points', rect, scale);
        break;
    case 'donate':
        me.drawButton(ctx, tss, labels[0], rect, scale, G_COLOR_TONE[0], G_COLOR_TONE[3]);
        break;
    case 'tithe':
        me.drawButton(ctx, tss, labels[1], rect, scale, G_COLOR_TONE[0], G_COLOR_TONE[3]);
        break;
    case 'done':
        me.drawButton(ctx, tss, labels[2], rect, scale, G_COLOR_TONE[0], G_COLOR_TONE[3]);
        break;
    case 'avatar':
        if (hero.getHp())
            me.fillIconText(ctx, tss, '`0'+stats[OBJECT_ICON], rect, scale);
        else
            me.drawButton(ctx, tss, '`0'+stats[OBJECT_ICON], rect, scale, G_COLOR_TONE[0], G_COLOR_TONE[2]);
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
        if (item) me.drawButton(ctx, tss, '`0'+item[OBJECT_ICON], rect, scale, G_COLOR_TONE[0], G_COLOR_TONE[2]);
        else me.drawButton(ctx, tss, 'Add '+G_EQUIP_NAME[equipId], rect, scale, G_COLOR_TONE[0], G_COLOR_TONE[2]);
        break;
    }
},
onCustomButton = function(ent, ctx, rect, ui, tss, scale){
    var
    mortal = this.mortal,
    appearance = mortal.appearance,
    stats = mortal.stats,
    id = ui.userData.id,
    label;

    switch(id){
    case 'donate':
        label = labels[0];
        break;
    case 'tithe':
        label = labels[1];
        break;
    case 'done':
        label = labels[2];
        break;
    case 'avatar':
        if (hero.getHp()) return;
        label = '`0'+stats[OBJECT_ICON];
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

        if (item) label = '`0'+item[OBJECT_ICON];
        else label = 'Add '+G_EQUIP_NAME[equipId];
        break;
    }
    me.drawButton(ctx, tss, label, rect, scale, G_COLOR_TONE[3], G_COLOR_TONE[0], G_COLOR_TONE[1], 3);
},
onCustomClick = function(ent, ui){
    if (!ui){
        return false;
    }
    var
    mortal = this.mortal,
    appearance = mortal.appearance,
    stats = mortal.stats,
    com = ent.getComponent(name),
    id = ui.userData.id;

    switch(id){
    case 'donate':
        this.go('showTrade', {
            info:['Select an item from your bag and make it an offerring to god'],
            content: hero.getBag() || [],
            labels:['Donate', 'Close'],
            type: G_UI.PIETY,
            market: trade.sellPrice,
            callbacks:['offerring']});
        return true;
    case 'tithe':
        var donation = tenth(hero.getGold());
        if (donation){
            this.go('showDialog', {
                info: [
                    'Do you want to contribute a one-tenth of your golds to god?',
                    'That\'s '+donation+' golds'],
                labels: ['Donate', 'Close'],
                callbacks: ['tenthing', null]
            });
        }else{
            this.go('showDialog', { info: ['You don\'t have enough gold'] });
        }
        return true;
    case 'done':
        isAltarOpened = false;
        this.go(callback);
        this.go('hideAltar');
        return true;
    case 'avatar':
        if (hero.getHp()) return true;
        this.go('showTrade', {
            info:['God Wodinaz is reincarnating you as a '+G_HERO_CLASS_NAME[stats[OBJECT_SUB_TYPE]],
            'you can spend some piety points to change it'],
            content: heroClasses,
            labels:['Change', 'Close'],
            type: G_UI.PIETY,
            market: trade.buyPrice,
            callbacks:['changeJob']});
        return true;
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
        item = slot[0],
        cost = FORGE_COST;

        if (item){
            cost = Max(1, cost - trade.buyPrice(item, slot[1]));
        }

        if (cost > me.getPiety()){
            this.go('showDialog', { info: ['You don\'t have enough piety', 'You need '+cost+' piety'] });
        }else{
            this.go('showDialog', {
                info: [
                    'Do you want to forge a '+G_EQUIP_NAME[equipId]+' with piety points?',
                    'That\'s '+cost+' piety'],
                labels: ['Forge', 'Close'],
                callbacks: ['holyForge', null],
                events:[equipId]
            });
        }
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
},
tenth = function(gold){
    return Ceil(gold/10);
};

me.init = function(name){
    var h = this.heaven;
    if (!h){
        h = [null, name, 0, heroProgress];
    }
    heroBody = h[GOD_BODY];
    heroName = name || h[GOD_NAME]; // always get new from loginPage
    heroPiety = h[GOD_PIETY];
    heroProgress = h[GOD_PROGRESS];
    return h;
};

me.exit = function(){
    this.heaven = [heroBody, heroName, heroPiety, heroProgress];
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
    comWin = ent.getComponent(com.win),
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

    return me.drawMeshUI.call(this, ctx, [this.tileSet], ent, com, comBox, scale, onCustomUI);
};

me.createHero = function(job){
    job = job || Round(G_ICON.ROGUE + Random()*(G_ICON.WARLOCK-G_ICON.ROGUE));

    var
    stats = G_CREATE_OBJECT(job, heroName),
    heroClass = stats[OBJECT_SUB_TYPE];

    return {
        //HERO_HELM=0,HERO_ARMOR=1,HERO_MAIN=2,HERO_OFF=3,HERO_RINGL=4,HERO_RINGR=5,HERO_AMULET=6,HERO_QUIVER=7,
        //HERO_HP=8,HERO_GOLD=9,HERO_PATK=10,HERO_RATK=11,HERO_DEF=12,HERO_WILL=13,HERO_LEVEL=14,
        //HERO_ENEMIES=15,HERO_PORTAL=16,HERO_WAYPOINT=17;
        appearance: [0, 0, 0, 0, 0, 0, 0, 0, stats[OBJECT_HP], 100, 0, 0, 0, 0, 1, 0, 0, 0],
        stats: stats,
        effects: [],
        bag: [
            [ai.spawnItem(G_ICON.DAGGER, G_LEGENDARY_RATE[0], G_GRADE.LEGENDARY, 1),1,0],
            [ai.spawnItem(G_ICON.SMALL_HP, null, G_GRADE.COMMON, 1),9999,1]
        ],
        tome: [
            tome.createSpell(G_ICON.GAZE, heroClass)
        ]
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

me.getPiety = function(){ return heroPiety; };
me.incrPiety = function(piety){ heroPiety += piety; };
me.getProgress = function(medalId){ return heroProgress[medalId] || 0; };
me.incrProgress = function(medalId, incr){ return heroProgress[medalId] = (heroProgress[medalId] || 0) + incr; };

me.toHeaven = function(appearance, stats){
    appearance[HERO_ENEMIES] = [];
    heroBody = [appearance, stats];
};

me.tenthing = function(elapsed, evt, entities){
    var donation = tenth(hero.getGold());

    hero.incrGold(-donation);
    me.incrPiety(donation);

    return entities;
};

me.changeJob = function(elapsed, evt, entities){
    var
    job = heroClasses[evt][0],
    price = trade.buyPrice(job, 1);

    if (price > me.getPiety()) return;

    me.incrPiety(-price);

    this.mortal = me.createHero(job[OBJECT_ICON]);

    this.go('hideTrade');
};

me.holyForge = function(elapsed, equipId, entities){
    var
    mortal = this.mortal,
    appearance = mortal.appearance,
    stats = mortal.stats,
    bag = mortal.bag,
    slot = appearance[equipId],
    item = slot[0],
    slotId = slot[2],
    cost = FORGE_COST;

    if (item){
        cost = Max(1, cost - trade.BuyPrice(item, slot[1]));
    }

    if (cost > me.getPiety()) return;

    me.incrPiety(-cost);

    slot = [
    ai.spawnItemByType(
        G_EQUIP_RATE[equipId],
        G_GRADE.ENCHANTED, 
        hero.getStat(OBJECT_LUCK), 
        hero.getStat(OBJECT_LEVEL)), slot[1], item ? bag.length : slotId];

    if (item) bag[slotId] = slot;
    else bag.push(slot);
    appearance[equipId] = slot;
};
