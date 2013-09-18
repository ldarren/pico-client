pico.def('god', function(){
    var
    me = this,
    heroBody,
    Floor = Math.floor, Ceil = Math.ceil, Random = Math.random, Round = Math.round;

    me.init = function(){
        var h = this.heaven;
        if (h){
            heroBody = h[0];
        }else{
            h = [];
        }
        return h;
    };

    me.exit = function(){
        this.heaven[0] = heroBody;
    };

    me.step = function(steps){
    };
    
    me.createHero = function(name){
        var
        job = Round(G_ICON.ROGUE + Random()*(G_ICON.WARLOCK-G_ICON.ROGUE)),
        stats = G_OBJECT[job].slice();

        stats[OBJECT_NAME] = name;

        return {
            // helm, armor, main hand, off hand, ring1, ring2, amulet, quiver, gold, skull, enemy, bag cap, spell cap
            appearance: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 8],
            stats: stats,
            effects: [],
            bag: [],
            tome: [G_OBJECT[G_ICON.ALL_SEEING].slice()]
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
