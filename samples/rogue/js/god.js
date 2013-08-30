pico.def('god', function(){
    var
    me = this,
    Floor = Math.floor, Ceil = Math.ceil, Random = Math.random;

    me.init = function(){
        return this.heaven;
    };

    me.exit = function(){
    };

    me.step = function(){
    };
    
    me.createHero = function(){
        var job = Floor(G_HERO.ROGUE + Random()*(G_HERO.WARLOCK-G_HERO.ROGUE));
        return {
            // job, helm, armor, main hand, off hand, ring1, ring2, amulet, gold, skull
            appearance: [job, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            stats: G_HERO_STAT[job-G_HERO.ROGUE].slice(),
            effects: [],
            bag: [],
            tome: [G_SPELL.ALL_SEEING.slice()]
        };
    };

    me.offering = function(){
    };

});
