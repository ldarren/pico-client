pico.def('uiPlayer', 'picBase', function(){
    var
    me = this,
    name = me.moduleName;

    me.create = function(ent, data){
        data.active = false;

        return data;
    };

    me.init = function(elapsed, evt, entities){
        var myOpt;
        for(var i=0, l=entities.length; i<l; i++){
            myOpt = entities[i].getComponent(name);
            if (myOpt) break;
        }

        var
        ts = evt.tileSet,
        theme = myOpt.theme,
        b = theme.BORDERS,
        borders = this.borders;

        borders.push(ts.cut(b.TOP));
        borders.push(ts.cut(b.LEFT));
        borders.push(ts.cut(b.BOTTOM));
        borders.push(ts.cut(b.RIGHT));
    };

    me.resize = function(elapsed, evt, entities){
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
            uiOpt.active = active;
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
