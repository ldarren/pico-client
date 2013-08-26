pico.def('god', function(){
    var
    me = this,
    Floor = Math.floor, Ceil = Math.ceil, Random = Math.random;

    me.init = function(){
    };

    me.exit = function(){
    };

    me.update = function(){
    };
    
    me.createHero = function(){
        return {
            appearance: {
                job: Floor(G_HERO.ROGUE + Random()*(G_HERO.WARLOCK-G_HERO.ROGUE)),
                helm: -1,
                armor: -1,
                main: -1,
                off: -1,
                ring1: -1,
                ring2: -1,
                amulet: -1
            },
            stats: {
                hp: 1,
                will: 1,
                strength: 1,
                defence: 1,
                wisdom: 1,
                protection: 1,
                dexterity: 1,
                luck: 1
            },
            bag: [],
            tome: []
        };
    };

    me.offering = function(){
    };

});
