pico.def('hero', function(){
    this.use('god');

    var
    me = this,
    db = window.localStorage,
    objects,
    position,
    activatedSkill = 0,
    heroObj,
    appearance,
    stats,
    bag,
    tome;

    me.init = function(objs, index){
        objects = objs;
        heroObj = objects[index];
        if (!heroObj){
            heroObj = {
                appearance: {},
                stats: {},
                bag:[],
                tome:[]
            };
        }
        position = index;
        appearance = heroObj.appearance;
        stats = heroObj.stats;
        bag = heroObj.bag;
        tome = heroObj.tome;
    };

    me.exit = function(){
    };

    me.update = function(){
    };

    me.move = function(index){
        delete objects[position];
        position = index;
        objects[index] = heroObj;
    };

    me.getPosition = function(){ return position; };
    me.getBag = function(){ return bag; };
    me.getTome = function(){ return tome; };

    me.reborn = function(){
    };
});
