pico.def('hero', function(){
    this.use('god');

    var
    me = this,
    Floor = Math.floor, Ceil = Math.ceil, Random = Math.random,
    objects,
    position,
    activatedSkill = 0,
    heroObj,
    appearance,
    stats,
    bag,
    tome;

    me.init = function(objs, mortal, index){
        heroObj = mortal;
        if (!heroObj){
            heroObj = me.god.createHero();
        }
        objects = objs;
        position = index;
        appearance = heroObj.appearance;
        stats = heroObj.stats;
        bag = heroObj.bag;
        tome = heroObj.tome;

        return heroObj;
    };

    me.exit = function(){
    };

    me.update = function(){
    };

    me.move = function(index){
        delete objects[position];
        position = index;
        objects[index] = appearance.job;
    };

    me.getActiveSpell = function(){ return undefined; };
    me.getPosition = function(){ return position; };
    me.getBag = function(){ return bag; };
    me.getTome = function(){ return tome; };

    me.reborn = function(){
    };
});
