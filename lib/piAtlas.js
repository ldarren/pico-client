pico.def('piAtlas', function(){
    var img, atlas;

    this.init = function(imgPath, atlasPath, cb){
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
                    cb();
                }
            });
        };
        img.src = imgPath;
    };

    this.drawImage = function(ctx, key, x, y, w, h){
        var s = atlas[key];
        if (!s) return;
        var
        sw = s.w,
        sh = s.h;
        ctx.drawImage(img, s.x, s.y, sw, sh, x, y, w || sw, h || sh);
    };
});
