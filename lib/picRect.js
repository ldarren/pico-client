inherit('pico/picBase');
me.create = function(entity, data){
    if (undefined === data.x) data.x = Math.random() * 20;
    if (undefined === data.y) data.y = Math.random() * 20;
    if (undefined === data.width) data.width = Math.random() * 10;
    if (undefined === data.height) data.height = Math.random() * 10;
    if (undefined === data.scale) data.scale = 1;
    if (undefined === data.head) data.head = 0;

    return {
        x: data.x,
        y: data.y,
        width: data.width,
        height: data.height,
        scale: data.scale,
        head: data.head
    };
};

me.move = function(entity, dx, dy){
    var
    o = entity.getComponent(me.moduleName),
    x = o.x,
    y = o.y;

    x += dx;
    y += dy;
};

me.moveTo = function(entity, x, y){
    var
    o = entity.getComponent(me.moduleName),
    x = o.x,
    y = o.y;

    x = x;
    y = y;
};
