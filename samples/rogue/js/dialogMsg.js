pico.def('dialogMsg', 'picUIWindow', function(){
    var
    me = this,
    Floor = Math.floor, Ceil = Math.ceil, Round = Math.round, Random = Math.random,
    name = me.moduleName,
    screenSize = [],
    layouts = [],
    msg;

    me.create = function(ent, data){
        var ts = this.tileSet;
        ts.assignPatternImg(data.background, ts.cut(data.background, this.tileWidth, this.tileHeight));

        data.font = this.smallDevice ? data.fontSmall : data.fontBig;

        data.minWidth = this.smallDevice ? 320 : 640;
        data.minHeight = this.smallDevice ? 180 : 360;
        return data;
    };

    me.open = function(elapsed, evt, entities){
        var ent = this.showEntity(G_WIN_ID.DIALOG);
        if (!ent) {
            ent = me.findHost(entities, G_WIN_ID.DIALOG);
        }
        if (!ent) return;

        msg = evt;
        layouts.length = 0;

        var 
        com = ent.getComponent(name),
        rect = ent.getComponent(com.box);

        rect.width = com.minWidth;
        rect.height = com.minHeight;
        rect.x = screenSize[0] + (screenSize[2] - rect.width)/2;
        rect.y = screenSize[1] + (screenSize[3] - rect.height)/2;

        if (!msg.labels) return [ent];

        var btnCount = msg.labels.length;

        if (btnCount > 0){
            var
            btnH = this.smallDevice ? 16 : 32, 
            btnW = Round(rect.width/btnCount),
            y = rect.y + rect.height - btnH;

            for(var i=0; i<btnCount; i++){
                layouts.push([rect.x + i * (btnW), y, btnW, btnH]);
            }
        }

        return [ent];
    };

    me.close = function(elapsed, evt, entities){
        var e = me.findHostByCom(entities, name);
        if (e){
            this.hideEntity(G_WIN_ID.DIALOG);
            msg = undefined;
            return [e];
        }
        return entities;
    };

    me.openIfValid = function(elapsed, evt, entities){
        if (msg){
            me.open.call(this, elapsed, msg, entities);
        }else{
            me.close.call(this, elapsed, msg, entities);
        }
        return entities;
    };

    me.resize = function(elapsed, evt, entities){

        screenSize = evt.slice();
        me.openIfValid.call(this, elapsed, evt, entities);

        return entities;
    };

    me.checkBound = function(elapsed, evt, entities){
        var
        x = evt[0], y = evt[1],
        unknowns = [],
        e, uiOpt, rectOpt;

        for (var i=0, l=entities.length; i<l; i++){
            e = entities[i];
            uiOpt = e.getComponent(name);
            if (!uiOpt) {
                unknowns.push(e);
                continue;
            }
            rectOpt = e.getComponent(uiOpt.box);
            if (rectOpt.x < x && (rectOpt.x + rectOpt.width) > x && rectOpt.y < y && (rectOpt.y + rectOpt.height) > y){
                return [e];
            }
        }

        return unknowns;
    };

    me.click = function(elapsed, evt, entities){
        var 
        e = entities[0],
        com = e.getComponent(name);

        if (!com) return entities;

        if (msg.callbacks){
            if (layouts.length){
                var
                x = evt[0],
                y = evt[1],
                btn;
                for(var i=0, l=layouts.length; i<l; i++){
                    btn = layouts[i];
                    if (x > btn[0] && x < btn[0]+btn[2] && y > btn[1] && y < btn[1]+btn[3]){
                        this.go('hideDialog');
                        if (msg.callbacks[i]) this.go(msg.callbacks[i], msg.evt);
                        break;
                    }
                }
            }else{
                this.go('hideDialog');
                if (msg.callbacks[0]) this.go(msg.callbacks[0], msg.evt);
            }
        }else{
            this.go('hideDialog');
        }
        return;
    };

    me.draw = function(ctx, ent, clip){

        if (!msg){
            me.close.call(this);
            return;
        }

        var
        com = ent.getComponent(name),
        rect = ent.getComponent(com.box),
        rectW = rect.width,
        ts = this.tileSet,
        tw = this.tileWidth,
        th = this.tileHeight,
        x = rect.x,
        y = rect.y,
        fontColor = G_COLOR_TONE[1],
        info = msg.info,
        labels = msg.labels,
        i, l;

        ctx.save();

        ctx.fillStyle = 'rgba(32,70,49,0.7)';
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
        ts.fillPattern(ctx, com.background, rect.x, rect.y, rect.width, rect.height);

        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.font = com.font;
        ctx.fillStyle = fontColor;
        for(i=0, l=info.length; i<l; i++){
            y = me.fillWrapText(ctx, info[i], x, y, rectW, th);
            //ctx.fillText(info[i], x, y+th*i, rectW);
        }
        // draw buttons
        me.drawButtons(ctx, layouts, labels, fontColor, G_COLOR_TONE[3], G_COLOR_TONE[3]);

        ctx.restore();
    };
});
