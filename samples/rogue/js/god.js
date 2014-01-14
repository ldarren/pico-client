pico.def('god', function(){
    var
    me = this,
    heroBody,
    heroName,
    Floor = Math.floor, Ceil = Math.ceil, Random = Math.random, Round = Math.round;

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
    
    me.createHero = function(){
        var
        job = Round(G_ICON.ROGUE + Random()*(G_ICON.WARLOCK-G_ICON.ROGUE)),
        stats = G_OBJECT[job].slice();

        stats[OBJECT_NAME] = heroName;

        return {
            // helm, armor, main hand, off hand, ring1, ring2, amulet, quiver, gold, skull, enemy, portal, way point, bag cap, spell cap
            appearance: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 8],
            stats: stats,
            effects: [],
            bag: [],
            tome: [G_OBJECT[G_ICON.GAZE].slice(), G_OBJECT[G_ICON.FIREBALL].slice()]
        };
    };

    me.getTomb = function(level){
        if (!heroBody) return;
        var
        appearance = heroBody[0],
        stats = heroBody[1];

        if (stats[OBJECT_LEVEL] !== level) return;

        var
        tomb = G_OBJECT[G_ICON.TOMB].slice(),
        remain = Round(Random()*HERO_AMULET);

        for(var i=0,l=HERO_QUIVER; i<l; i++){
            if (remain === i) continue;
            delete appearance[i];
        }

        tomb[TOMB_BODY] = appearance;
        tomb[OBJECT_NAME] = stats[OBJECT_NAME]+' '+G_OBJECT_NAME[tomb[OBJECT_ICON]];
        heroBody = undefined;
        return tomb; 
    };

    me.offering = function(){
    };

    me.toHeaven = function(appearance, stats){
        appearance[HERO_ENEMY] = undefined;
        heroBody = [appearance, stats];
    };

});
