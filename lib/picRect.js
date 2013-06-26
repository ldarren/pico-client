pico.def('picRect', function(){
    var
    me = this,
    CURRENT = 0,
    TARGET = 1,
    RATE = 2;

    me.create = function(entity, data){
        if (undefined === data.x) data.x = [0, 0, 1]; // tween value, [current value, target value, rate]
        if (undefined === data.y) data.y = [0, 0, 1];
        if (undefined === data.w) data.w = [10, 10, 1];
        if (undefined === data.h) data.h = [10, 10, 1];
        if (undefined === data.scale) data.scale = [1, 1, 1];
        if (undefined === data.head) data.head = [1, 1, 1];

        return data;
    };

    me.move = function(entity, dx, dy){
        var
        o = entity.getComponent(me.moduleName),
        x = o.x,
        y = o.y;

        x[TARGET] += dx;
        y[TARGET] += dy;
    };

    me.moveTo = function(entity, x, y){
        var
        o = entity.getComponent(me.moduleName),
        x = o.x,
        y = o.y;

        x[TARGET] = x;
        y[TARGET] = y;
    };
});
