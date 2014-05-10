inherit('pico/picBase');
var Floor = Math.floor, Ceil = Math.ceil;

me.create = function(ent, data){
    if (!data.content) console.error(me.moduleName, 'create component without content');
    if (!data.box) console.error(me.moduleName, 'create component without box');

    return {
        content: data.content,
        contentSize: [0,0],
        box: data.box,
        background: data.background || '#000',
        resizable: data.resizable || false,
        active: false,
        maximized: 0,
        layouts: [],
        docks: [],
        minWidth: 128,
        minHeight: 128,
        theme: data.theme, // optional
        gridSize: 8,
        canvas: document.createElement('canvas'),
        scrollX: 0,
        scrollY: 0,
        scrollBarH: 0,
        scrollBarV: 0,
        isValidClick: false, // disable click if content scroll
    };
};

me.fitIntoGrid = function(rect, gzX, gzY, smaller){
    var
    roundTL = smaller ? Ceil : Floor,
    roundBR = smaller ? Floor : Ceil,
    t = rect[1],
    l = rect[0],
    r = l + rect[2],
    b = t + rect[3];

    t = roundTL(t / gzY)*gzY;
    l = roundTL(l / gzX)*gzX;
    b = roundBR(b / gzY)*gzY;
    r = roundBR(r / gzX)*gzX;

    rect[0] = l;
    rect[1] = t;
    rect[2] = r - l;
    rect[3] = b - t;
    return rect;
};

me.draw = function(ctx, ent, clip){
    // place holder
};

me.drawScreenshot = function(ctx, ent, clip, bitmap){
    // place holder
};
