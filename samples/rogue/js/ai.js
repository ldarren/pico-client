pico.def('ai', function(){
    var
    me = this,
    Floor = Math.floor, Ceil = Math.ceil, Random = Math.random,
    objects;

    me.init = function(theme, objs){
        objects = objs;
    };

    me.exit = function(){
    };

    me.update = function(){
    };

    me.changeTheme = function(theme){
    };

    me.spawnCreep = function(){
        return G_CREEP.RAT + Floor(Random() * (G_CREEP.DEVIL - G_CREEP.RAT));
    };

    me.spawnChest = function(){
        return G_OBJECT.CHEST;
    };

});
