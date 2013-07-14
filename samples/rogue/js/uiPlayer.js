pico.def('uiPlayer', 'picBase', function(){
    this.use('picTween');

    var
    me = this,
    name = me.moduleName,
    getMyComponent = function(entities){
        var myCom;
        for(var i=0, l=entities.length; i<l; i++){
            myCom = entities[i].getComponent(name);
            if (myCom) break;
        }
        return myCom;
    };

    me.create = function(ent, data){
        var
        ts = this.tileSet,
        theme = data.theme,
        b = theme.BORDERS,
        borders = this.borders;

        borders.push(ts.cut(b.TOP));
        borders.push(ts.cut(b.LEFT));
        borders.push(ts.cut(b.BOTTOM));
        borders.push(ts.cut(b.RIGHT));

        data.active = false;
        data.maximized = false;
        data.minWidth = this.smallDevice ? 320 : 640;
        data.minHeight = this.tileHeight;

        return data;
    };

    me.resize = function(elapsed, evt, entities){
        var com = getMyComponent(entities);
        if (!com) return entities;

        var
        tween = me.picTween,
        e = com.host,
        tweenCom = e.getComponent(com.tween),
        boxName = com.box,
        x, y, width, height;

        if (com.minimized){
            width = com.minWidth;
            height = com.minHeight;
            x = Math.floor((evt.width - width)/2);
            y = Math.floor(evt.height - height);
        }else{
            width = evt.width;
            height = evt.height;
            x = 0;
            y = 0;
        }

        tween.set(tweenCom, boxName, {x:x, y:y, width:width, height:height});

        return entities;
    };

    me.click = function(elapsed, evt, entities){
        var e, active, uiOpt, rectOpt;
        for (var i=0, l=entities.length; i<l; i++){
            e = entities[i];
            uiOpt = e.getComponent(name);
            if (!uiOpt) continue;
            rectOpt = e.getComponent(uiOpt.box);
            active = (rectOpt.x < evt.x && (rectOpt.x + rectOpt.width) > evt.x && rectOpt.y < evt.y && (rectOpt.y + rectOpt.height) > evt.y);
            if (active !== uiOpt.active){
                uiOpt.active = active;
                return [e];
            }
        }
        return entities;
    };

    me.draw = function(ctx, ent, clip){
        var uiOpt = ent.getComponent(name);

        if (!uiOpt) return;

        var
        rectOpt = ent.getComponent(uiOpt.box),
        ts = this.tileSet,
        theme, borders = this.borders;
        
        if (uiOpt.active){
            theme = uiOpt.theme.ACTIVE;
        }else{
            theme = uiOpt.theme.INACTIVE;
        }

        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = uiOpt.background;
        ctx.fillRect(rectOpt.x, rectOpt.y, rectOpt.width, rectOpt.height);

        ctx.fillStyle = ctx.createPattern(borders[0], 'repeat');
        ctx.fillRect(rectOpt.x, rectOpt.y, rectOpt.width, 8);

        ctx.fillStyle = ctx.createPattern(borders[3], 'repeat');
        ctx.fillRect(rectOpt.x + rectOpt.width - 8, rectOpt.y, 8, rectOpt.height);

        ctx.fillStyle = ctx.createPattern(borders[2], 'repeat');
        ctx.fillRect(rectOpt.x, rectOpt.y+rectOpt.height-8, rectOpt.width, 8);

        ctx.fillStyle = ctx.createPattern(borders[1], 'repeat');
        ctx.fillRect(rectOpt.x, rectOpt.y, 8, rectOpt.height);

        ts.draw(ctx, theme.TOP_LEFT, rectOpt.x, rectOpt.y);
        ts.draw(ctx, theme.TOP_RIGHT, rectOpt.x + rectOpt.width - 8, rectOpt.y);
        ts.draw(ctx, theme.BOTTOM_LEFT, rectOpt.x, rectOpt.y + rectOpt.height - 8);
        ts.draw(ctx, theme.BOTTOM_RIGHT, rectOpt.x + rectOpt.width - 8, rectOpt.y + rectOpt.height - 8);
        ctx.restore();

    };
});
