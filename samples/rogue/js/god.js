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
    
    me.createHero = function(){
        var job = Round(G_ICON.ROGUE + Random()*(G_ICON.WARLOCK-G_ICON.ROGUE));
        return {
            // job, helm, armor, main hand, off hand, ring1, ring2, amulet, gold, skull, enemy
            appearance: [job, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            stats: G_OBJECT[job].slice(),
            effects: [],
            bag: [],
            tome: [G_SPELL.ALL_SEEING.slice(),G_SPELL.ALL_SEEING.slice()]
        };
    };

    me.offering = function(){
    };

});
