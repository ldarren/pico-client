pico.def('god', function(){
    var
    me = this,
    Floor = Math.floor, Ceil = Math.ceil, Random = Math.random;

    me.init = function(){
        return this.heaven;
    };

    me.exit = function(){
    };

    me.update = function(){
    };
    
    me.createHero = function(){
        var job = Floor(G_HERO.ROGUE + Random()*(G_HERO.WARLOCK-G_HERO.ROGUE));
        return {
            // job, helm, armor, main hand, off hand, ring1, ring2, amulet, gold, skull
            appearance: [job, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            stats: G_HERO_STAT[job-G_HERO.ROGUE].slice(),
            spells: [],
            debuf: [5, 7, 8],
            bag: [],
            tome: [G_SPELL.ALL_SEEING]
        };
    };

    me.offering = function(){
    };

});
