pico.def('uiPlayer', 'picBase', function(){

    var
    me = this,
    name = me.moduleName,
    layouts = [],
    fitGridMap = function(rect, gzX, gzY, smaller){
        var
        roundTL = smaller ? Math.ceil : Math.floor,
        roundBR = smaller ? Math.floor : Math.ceil,
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

    me.create = function(ent, data){
        var
        ts = this.tileSet,
        theme = data.theme,
        b = theme.BORDERS,
        borders = this.borders;

        data.active = false;
        data.maximized = 0;
        var gs = data.gridSize = this.smallDevice ? 8 : 16;
        data.minWidth = this.smallDevice ? 320 : 640;
        data.minHeight = this.tileHeight;

        borders.push(ts.cut(b.TOP, gs, gs));
        borders.push(ts.cut(b.LEFT, gs, gs));
        borders.push(ts.cut(b.BOTTOM, gs, gs));
        borders.push(ts.cut(b.RIGHT, gs, gs));

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
        gs = com.gridSize,
        boxName = com.box,
        boxCom = e.getComponent(boxName),
        layout;

        layouts.length = 0;

        layouts.push(fitGridMap(
            [evt[0] + Math.floor((evt[2] - com.minWidth)/2), evt[1] + evt[3] - com.minHeight, com.minWidth, com.minHeight],
            gs, gs, false));
        layouts.push(fitGridMap([evt[0]+1, evt[1]+1, evt[2]-2, evt[3]-2], gs, gs, true));

        layout = layouts[com.maximized];

        boxCom.x = layout[0];
        boxCom.y = layout[1];
        boxCom.width = layout[2];
        boxCom.height = layout[3];

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
            }
            if (active){
                uiOpt.maximized = uiOpt.maximized ? 0 : 1;
                var layout = layouts[uiOpt.maximized];
                rectOpt.x = layout[0];
                rectOpt.y = layout[1];
                rectOpt.width = layout[2];
                rectOpt.height = layout[3];
                return [e];
            }
            break;
        }
        return entities;
    };

    me.draw = function(ctx, ent, clip){
        var uiOpt = ent.getComponent(name);

        if (!uiOpt) return;

        var
        gs = uiOpt.gridSize,
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
        ctx.fillRect(rectOpt.x, rectOpt.y, rectOpt.width, gs);

        ctx.fillStyle = ctx.createPattern(borders[3], 'repeat');
        ctx.fillRect(rectOpt.x + rectOpt.width - gs, rectOpt.y, gs, rectOpt.height);

        ctx.fillStyle = ctx.createPattern(borders[1], 'repeat');
        ctx.fillRect(rectOpt.x, rectOpt.y, gs, rectOpt.height);

        ts.draw(ctx, theme.TOP_LEFT, rectOpt.x, rectOpt.y, gs, gs);
        ts.draw(ctx, theme.TOP_RIGHT, rectOpt.x + rectOpt.width - gs, rectOpt.y, gs, gs);

        if (uiOpt.maximized){
            ctx.fillStyle = ctx.createPattern(borders[2], 'repeat');
            ctx.fillRect(rectOpt.x, rectOpt.y+rectOpt.height-gs, rectOpt.width, gs);

            ts.draw(ctx, theme.BOTTOM_LEFT, rectOpt.x, rectOpt.y + rectOpt.height - gs, gs, gs);
            ts.draw(ctx, theme.BOTTOM_RIGHT, rectOpt.x + rectOpt.width - gs, rectOpt.y + rectOpt.height - gs, gs, gs);
        }

        ctx.restore();

    };
});
