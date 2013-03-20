pico.def('piAtlas', function(){

    function Sheet(img, atlas){
        this.img = img;
        this.atlas = atlas;
    }

    this.create = function(imgPath, atlasPath, cb){
        img = new Image();
        img.onload = function(){
            pico.ajax('get', atlasPath, null, {}, function(err, xhr){
                if (err) return console.error(err);
                if (4 === xhr.readyState){
                    try{
                        atlas = JSON.parse(xhr.responseText);
                    }catch(ex){
                        return console.error(atlasPath, ex);
                    }
                    cb(null, new Sheet(img, atlas));
                }
            });
        };
        img.onerror = function(err){
            console.error(err);
        };
        img.src = imgPath;
    };

    Sheet.prototype.drawImage = function(ctx, key, x, y, w, h){
        var s = this.atlas[key];
        if (!s) return;
        var
        sw = s.w,
        sh = s.h;
        ctx.drawImage(this.img, s.x, s.y, sw, sh, x, y, w || sw, h || sh);
    };
});
