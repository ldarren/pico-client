pico.def('uiPlayer', 'picBase', function(){
    this.use('picTween');

    var
    me = this,
    name = me.moduleName,
    layouts = [],
    tween,
    onStop = function(game, ent, tweenName, targetName){
        if (targetName === 'picRect') game.stopLoop('uiAnim');
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
        data.maximized = 0;
        data.minWidth = this.smallDevice ? 320 : 640;
        data.minHeight = this.tileHeight;

        tween = me.picTween;
        tween.slot('stop', onStop);

        return data;
    };

    me.resize = function(elapsed, evt, entities){
        var com, e;
        for(var i=0, l=entities.length; i<l; i++){
            e = entities[i];
            com = e.getComponent(name);
            if (com) break;
        }
        if (!com) return entities;

        var
        tween = me.picTween,
        tweenCom = e.getComponent(com.tween),
        boxName = com.box,
        boxCom = e.getComponent(boxName),
        tweenBox = tween.get(tweenCom, boxName),
        layout;

        layouts.length = 0;

        layouts.push([evt[0] + Math.floor((evt[2] - com.minWidth)/2), evt[1] + evt[3] - com.minHeight, com.minWidth, com.minHeight]);
        layouts.push([evt[0], evt[1], evt[2], evt[3]]);

        layout = layouts[com.maximized];

        boxCom.x = tweenBox.x = layout[0];
        boxCom.y = tweenBox.y = layout[1];
        boxCom.width = tweenBox.width = layout[2];
        boxCom.height = tweenBox.height = layout[3];

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
            if (active){
                uiOpt.maximized = uiOpt.maximized ? 0 : 1;
                var layout = layouts[uiOpt.maximized];
                rectOpt.x = layout[0];
                rectOpt.y = layout[1];
                rectOpt.width = layout[2];
                rectOpt.height = layout[3];
                this.startLoop('uiAnim');
            }
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
        tweenOpt = ent.getComponent(uiOpt.tween),
        rectOpt = tween.get(tweenOpt, uiOpt.box),
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
