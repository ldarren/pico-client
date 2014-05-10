// this library translate hexagonal coordinate to screen coordinate vice versa
function HexGameMap(name, screen, tile, col, row, map){
    this.name = name;

    var
    tileSide = tile.side,
    tileBase = tile.base,
    tileW = tileBase + tileSide * 2,
    tileH = tile.height;

    this.tileW = tileW;
    this.tileH = tileH;
    this.tileSide = tileSide;
    this.tileBase = tileBase;
    this.mapW = Math.ceil(col * (tileSide + tileBase)+tileSide);
    this.mapH = Math.ceil((row * tileH) + (tileH * 0.5));
    this.col = col;
    this.row = row;
    this.offsetX = 0;
    this.offsetY = 0;

    if (!map){
        map = [];
        for (var i=0, l=col*row; i<l; i++){
            map.push({id:i,x:Math.floor(i%col),y:Math.floor(i/col)});
        }
    }
    this.map = map;

    this.resize(screen.width, screen.height);
}

HexGameMap.prototype.save = function(){
    return {
        name: this.name,
        tile: {width: this.tileW, height: this.tileH},
        col: this.col,
        row: this.row,
        map: this.map
    };
};

HexGameMap.prototype.pan = function(dx, dy){
    var
    sw = this.screenW,
    sh = this.screenH,
    tb = this.tileBase,
    ts = this.tileSide,
    th = this.tileH,
    th2 = Math.floor(th/2),
    tw = this.tileW,
    tbs = tb + ts,
    ox = this.offsetX + dx,
    oy = this.offsetY + dy;

    if (ox + this.mapW < 0) dx = 0;
    if (ox > sw) dx = 0;
    if (oy + this.mapH < 0) dy = 0;
    if (oy > sh) dy = 0;
    if (!dx && !dy) return;

    var
    oi = Math.floor(-ox / tbs), // number of view offset to map's i, j
    oj = Math.floor(-oy / th),
    viewX = ox % tbs,
    viewY = oy % th2;

    if (viewX > 0) viewX = viewX - tbs;
    if (viewY > 0) viewY = viewY - th2;

    var
    li = Math.ceil((sw -ts - viewX) / tbs),
    lj = Math.ceil((sh - viewY) / th),
    view = [],
    i, j, fx, fy,
    px, py, // pointing ox and oy that pointing to map coordinate
    data;

    for(i=0; i<li; i++){
        fy = i % 2 ? -tb : 0;
        fx = Math.floor(i * tbs);
        px = i + oi;
        for (j=0; j<lj; j++){
            py = j + oj;
            data = this.getMapTile(px, py);
            view.push({x:fx+viewX, y:Math.floor((j * th)+fy)+viewY, data:data});
        }
    }

    this.view = view;
    this.offsetX = ox;
    this.offsetY = oy;
    me.signal(me.UPDATE, [this]);
};

HexGameMap.prototype.resize = function(width, height){
    this.screenW = width;
    this.screenH = height;

    var
    x = Math.ceil((width - this.mapW)/2),
    y = Math.ceil((height - this.mapH)/2);

    this.pan(x - this.offsetX, y - this.offsetY);
};

HexGameMap.prototype.eachViewTile = function(cb){
    var v = this.view;
    for (var i=0,l=v.length; i<l; i++){
        cb(v[i]);
    }
};

HexGameMap.prototype.eachMapTile = function(cb){
    var m = this.map;
    for (var i=0,l=m.length; i<l; i++){
        cb(m[i]);
    }
};

HexGameMap.prototype.getMapTile = function(x, y){
    if (x < 0 || y < 0 || x >= this.col || y >= this.row) return;
    return this.map[y * this.col + x];
};

HexGameMap.prototype.getViewTile = function(x, y){
    return this.view[y * this.col + x];
};

HexGameMap.prototype.getPath = function(from, to){
    var path = [];

    var
    fx = from.x,
    fy = from.y,
    tx = to.x,
    ty = to.y;

    path.push(this.getViewTile[fx, fy]);

    while (fx !== tx && fy !== ty){
        if (fx !== tx) fx += (tx > fx) ? 1 : -1;
        if (fy !== ty) fy += (ty > fy) ? 1 : -1;
        path.push(this.getViewTile[fx, fy]);
    }

    return path;
};

Object.defineProperties(this, {
    N: {value:32, writable:false, configurable:false, enumerable:true},
    NE: {value:16, writable:false, configurable:false, enumerable:true},
    SE: {value:8, writable:false, configurable:false, enumerable:true},
    S: {value:4, writable:false, configurable:false, enumerable:true},
    SW: {value:2, writable:false, configurable:false, enumerable:true},
    NW: {value:1, writable:false, configurable:false, enumerable:true},
    UPDATE: {value:'update', writable:false, configurable:false, enumerable:true}});

me.create = function(name, screen, tile, col, row){
    return new HexGameMap(name, screen, tile, col, row);
};

me.load = function(screen, obj){
    return new HexGameMap(obj.name, screen, obj.tile, obj.col, obj.row, obj.map);
};
