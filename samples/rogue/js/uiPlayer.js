pico.def('uiPlayer', 'picBase', function(){
    var
    me = this,
    name = me.moduleName;

    me.create = function(ent, data){
        data.active = false;
        return data;
    };

    me.resize = function(elapsed, evt, entities){
        return entities;
    };

    me.click = function(elapsed, evt, entities){
        var e, uiOpt, rectOpt;
        for (var i=0, l=entities.length; i<l; i++){
            e = entities[i];
            uiOpt = e.getComponent(name);
            if (!uiOpt) continue;
            rectOpt = e.getComponent(uiOpt.box);
            if (rectOpt.x < evt.x && (rectOpt.x + rectOpt.width) > evt.x && rectOpt.y < evt.y && (rectOpt.y + rectOpt.height) > evt.y)
                return [e];
        }
        return entities;
    };

    me.draw = function(ctx, ent, clip){
        var uiOpt = ent.getComponent(name);

        if (!uiOpt) return;

        var
        rectOpt = ent.getComponent(uiOpt.box),
        ts = this.tileSet,
        theme = uiOpt.theme[uiOpt.active ? 'ACTIVE' : 'INACTIVE'];

        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = uiOpt.background;
        ctx.fillRect(rectOpt.x, rectOpt.y, rectOpt.width, rectOpt.height);
        ts.draw(ctx, theme.TOP_LEFT, rectOpt.x, rectOpt.y);
        ts.draw(ctx, theme.TOP_RIGHT, rectOpt.x + rectOpt.width - 8, rectOpt.y);
        ts.draw(ctx, theme.BOTTOM_LEFT, rectOpt.x, rectOpt.y + rectOpt.height - 8);
        ts.draw(ctx, theme.BOTTOM_RIGHT, rectOpt.x + rectOpt.width - 8, rectOpt.y + rectOpt.height - 8);
        ctx.restore();

    };
});
