pico.def('dialogMsg', 'picUIWindow', function(){
    var
    me = this,
    msg,
    name = me.moduleName,
    findMyFirstEntity = function(entities){
        if (!entities) return;
        var e, com;
        for(var i=0, l=entities.length; i<l; i++){
            e = entities[i];
            com = e.getComponent(name);
            if (com) return e;
        }
    };

    me.open = function(elapsed, evt, entities){
        this.showEntity(G_WIN_ID.DIALOG);
        msg = evt;
        return entities;
    };

    me.close = function(elapsed, evt, entities){
        var e = findMyFirstEntity(entities);
        if (e){
            this.hideEntity(G_WIN_ID.DIALOG);
            msg = undefined;
            return [e];
        }
    };

    me.openIfValid = function(elapsed, evt, entities){
        if (msg){
            me.open.call(this, elapsed, msg, entities);
        }else{
            me.close.call(this, elapsed, msg, entities);
        }
        return entities;
    };

    me.click = function(elapsed, evt, entities){
        var 
        e = entities[0],
        com = e.getComponent(name);
        if (!com) return entities;
        this.go('hideDialog');
        this.go(msg.callback);
        return;
    };

    me.draw = function(ctx, ent, clip){
        if (!msg){
            me.close.call(this);
            return;
        }

        var
        com = ent.getComponent(name),
        win = ent.getComponent(com.win),
        gs2 = win.gridSize * 2,
        rect = ent.getComponent(win.box),
        rectW = rect.width,
        tw = this.tileWidth,
        th = this.tileHeight,
        x = rect.x + gs2,
        y = rect.y + gs2,
        info = msg.info;

        ctx.save();
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.font = com.font;
        ctx.fillStyle = com.fontColor;
        for(var i=0, l=info.length; i<l; i++){
            ctx.fillText(info[i], x, y+th*i, rectW);
        }
        ctx.restore();
    };
});
