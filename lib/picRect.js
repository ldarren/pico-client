pico.def('picRect', function(){
    var me = this;

    me.create = function(entity, data){
        if (undefined === data.x) data.x = 0;
        data.oX = data.x;
        if (undefined === data.y) data.y = 0;
        data.oY = data.y;
        if (undefined === data.w) data.w = 10;
        data.oW = data.w;
        if (undefined === data.h) data.h = 10;
        data.oH = data.h;
        if (undefined === data.scale) data.scale = 1;
        data.oScale = data.scale;
        if (undefined === data.head) data.head = 0;
        data.oHead = data.head;

        return data;
    };

    me.move = function(entity, dx, dy){
        var o = entity.getComponent(me);
        o.oX = o.x;
        o.oY = o.y;
        o.x += dx;
        o.y += dy;
    };

    me.moveTo = function(entity, x, y){
        var o = entity.getComponent(me);
        o.oX = o.x;
        o.oY = o.y;
        o.x = x;
        o.y = y;
    };

    me.update = function(elpased, entities){
    };
});
