pico.def('piAtlas', function(){

    var
    me = this,
    X = 0, Y = 1, W = 2, H = 3, // atlas constant
    directory = {};

    function Sheet(img, atlas){
        this.img = img;
        this.atlas = atlas;
    }

    Sheet.prototype.getDimension = function(key){
        return this.atlas[key];
    };

    Sheet.prototype.draw = function(ctx, key, x, y, w, h){
        var s = this.atlas[key];
        if (!s) return;
        var sw = s[W], sh = s[H];
        ctx.drawImage(this.img, s[X], s[Y], sw, sh, x, y, w || sw, h || sh);
    };

    Sheet.prototype.cut = function(key, x, y, w, h){
        var s = this.atlas[key];
        if (!s) return;

        var
        canvas = new Canvas(),
        ctx = canvas.getContext('2d'),
        sw = s[W],
        sh = s[H];

        w = w || sw;
        h = h || sh;

        canvas.setAttribute('width', w);
        canvas.setAttribute('height', h);

        ctx.drawImage(this.img, s[X], s[Y], sw, sh, x, y, w, h);
        
        return canvas;
    };

    this.create = function(imgPath, atlasPath, cb){
        var
        key = imgPath + atlasPath,
        sheet = directory[key];

        if (sheet) return cb(null, sheet);

        img = new Image();
        img.onload = function(){
            pico.ajax('get', atlasPath, null, {}, function(err, xhr){
                if (err) return console.error(err);
                if (4 === xhr.readyState){
                    try{ atlas = JSON.parse(xhr.responseText); }
                    catch(ex){ return console.error(atlasPath, ex); }
                    sheet = new Sheet(img, atlas);
                    directory[key] = sheet;
                    cb(null, sheet);
                }
            });
        };
        img.onerror = function(err){ console.error(err); };
        img.src = imgPath;
    };
});
