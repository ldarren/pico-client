pico.def('god', function(){
    var
    me = this,
    Floor = Math.floor, Ceil = Math.ceil, Random = Math.random;

    me.init = function(heaven){
        return heaven;
    };

    me.exit = function(){
    };

    me.update = function(){
    };
    
    me.createHero = function(){
        var job = Floor(G_HERO.ROGUE + Random()*(G_HERO.WARLOCK-G_HERO.ROGUE));
        return {
            // job, helm, armor, main hand, off hand, ring1, ring2, amulet, gem, gold, skull
            appearance: [job, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            stats: G_HERO_STAT[job-G_HERO.ROGUE].slice(),
            spells: [],
            debuf: [5, 7, 8],
            bag: [],
            tome: [G_MARK.EYE_OF_GOD]
        };
    };

    me.offering = function(){
    };

});
