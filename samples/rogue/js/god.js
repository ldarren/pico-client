pico.def('god', function(){
    var
    me = this,
    Floor = Math.floor, Ceil = Math.ceil, Random = Math.random, Round = Math.round;

    me.init = function(){
        return this.heaven;
    };

    me.exit = function(){
    };

    me.step = function(steps){
    };
    
    me.createHero = function(name){
        var
        job = Round(G_ICON.ROGUE + Random()*(G_ICON.WARLOCK-G_ICON.ROGUE)),
        stats = G_OBJECT[job].slice();

        stats[OBJECT_NAME] = name;

        return {
            // helm, armor, main hand, off hand, ring1, ring2, amulet, gold, skull, enemy
            appearance: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            stats: stats,
            effects: [],
            bag: [],
            tome: [G_OBJECT[G_ICON.ALL_SEEING].slice()]
        };
    };

    me.offering = function(){
    };

});
