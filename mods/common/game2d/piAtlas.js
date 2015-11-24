var
X = 0, Y = 1, W = 2, H = 3, // atlas constant
directory = {};

function Sheet(img, atlas){
    this.img = img;
    this.atlas = atlas;
    this.patterns = {};
    this.patternImgs = {};
}

Sheet.prototype = {
    getDimension: function(key){
        var dim = this.atlas[key];
        if (!dim) return;
        return dim.slice();
    },

    draw: function(ctx, key, x, y, w, h, cx, cy, cw, ch){
        var s = this.atlas[key];
        if (!s) return;
        var sw = s[W], sh = s[H];
        ctx.drawImage(this.img, s[X]+(cx||0), s[Y]+(cy||0), cw||sw, ch||sh, x, y, w || sw, h || sh);
    },

    cut: function(key, w, h){
        var s = this.atlas[key];
        if (!s) return;

        var
        canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        sw = s[W],
        sh = s[H];

        w = w || sw;
        h = h || sh;

        canvas.setAttribute('width', w);
        canvas.setAttribute('height', h);

        ctx.drawImage(this.img, s[X], s[Y], sw, sh, 0, 0, w, h);
        return canvas;
    },

    paste: function(copy, x, y, w, h, key, cx, cy, cw, ch){
        var s = this.atlas[key];
        if (!s) return;

        var
        canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        img = this.img,
        sx = s[X],
        sy = s[Y],
        sw = s[W],
        sh = s[H];

        w = w || sw;
        h = h || sh;
        cw = cw || sw;
        ch = ch || sh;
        cx = cx || 0;
        cy = cy || 0;

        canvas.setAttribute('width', img.width);
        canvas.setAttribute('height', img.height);
        ctx.drawImage(img, 0, 0);
        ctx.clearRect(sx, sy, sw, sh);

        ctx.drawImage(copy, x, y, w, h, sx+cx, sy+cy, cw, ch);

        this.img = canvas;
    },

    assignPatternImg: function(key, img){
        this.patternImgs[key] = img;
    },

    unassignPatternImg: function(key){
        delete this.patternImgs[key];
    },

    getPatternImg: function(key) { return this.patternImgs[key]; },

    createPattern: function(ctx, key){
        var img = this.patternImgs[key];
        if (!img) return;
        var p = ctx.createPattern(img, 'repeat');
        this.patterns[key] = p;
        return p;
    },

    removePattern: function(key){
        delete this.patterns[key];
    },

    fillPattern: function(ctx, key, x, y, w, h){
        ctx.fillStyle = this.patterns[key] || this.createPattern(ctx, key);
        ctx.fillRect(x, y, w, h);
    },
};

me.create = function(imgPath, atlasPath, cb){
    var
    key = imgPath + atlasPath,
    sheet = directory[key];

    if (sheet) return cb(null, sheet);

    var img = new Image();
    img.onload = function(){
        pico.ajax('get', atlasPath, null, {}, function(err, xhr){
            if (err) return cb(err);
            if (4 === xhr.readyState){
                try{ var atlas = JSON.parse(xhr.responseText); }
                catch(ex){ return cb(ex); }
                sheet = new Sheet(img, atlas);
                directory[key] = sheet;
                cb(null, sheet);
            }
        });
    };
    img.onerror = function(err){ console.error(err); };
    img.src = imgPath;
};

me.blank = function(id, w, h, atlas, cb){
    var sheet = directory[id];

    if (sheet) return cb(null, sheet);

    var
    img = new Image(),
    canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d');

    canvas.setAttribute('width', w);
    canvas.setAttribute('height', h);

    ctx.clearRect(0, 0, w, h);
    img.src = canvas.toDataURL();
    img.width = w;
    img.height = h;
    
    sheet = new Sheet(img, atlas),

    directory[id] = sheet;

    cb(null, sheet);
};
