pico.def('dialogMsg', 'picUIWindow', function(){
    var
    me = this,
    info,
    name = me.moduleName,
    findMyFirstEntity = function(entities){
        var e, com;
        for(var i=0, l=entities.length; i<l; i++){
            e = entities[i];
            com = e.getComponent(name);
            if (com) return e;
        }
    };

    me.open = function(elapsed, evt, entities){
        this.showEntity(G_WIN_ID.DIALOG);
        info = evt;
        return entities;
    };

    me.close = function(elapsed, evt, entities){
        var e = findMyFirstEntity(entities);
        if (e){
            this.hideEntity(G_WIN_ID.DIALOG);
            info = undefined;
            return [e];
        }
        return entities;
    };

    me.openIfValid = function(elapsed, evt, entities){
        if (info){
            me.open.call(this, elapsed, info, entities);
        }else{
            me.close.call(this, elapsed, info, entities);
        }
        return entities;
    };

    me.click = function(elapsed, evt, entities){
        var e, com;
        for(var i=0,l=entities.length; i<l; i++){
            e = entities[i];
            com = e.getComponent(name);
            if (!com) continue;
            this.go('nextLevel');
            return me.close.call(this, elapsed, info, entities);
        }
        return entities;
    };

    me.draw = function(ctx, ent, clip){
        if (!info){
            me.close.call(this);
            return;
        }

        var
        com = ent.getComponent(name),
        win = ent.getComponent(com.win),
        rect = ent.getComponent(win.box),
        tw = this.tileWidth,
        th = this.tileHeight,
        x = rect.x + win.gridSize + 8,
        y = rect.y + win.gridSize + 8;

        ctx.save();
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.font = com.font;
        ctx.fillStyle = com.fontColor;
        for(var i=0, l=info.length; i<l; i++){
            ctx.fillText(info[i], x, y+th*i, rect.width);
        }
        ctx.restore();
    };
});
