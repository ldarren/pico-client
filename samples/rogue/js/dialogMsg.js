pico.def('dialogMsg', 'picUIWindow', function(){
    var
    me = this,
    name = me.moduleName,
    layouts = [],
    msg;

    me.create = function(ent, data){
        data.font = this.smallDevice ? data.fontSmall : data.fontBig;
        return data;
    };

    me.open = function(elapsed, evt, entities){
        var ent = this.showEntity(G_WIN_ID.DIALOG);
        msg = evt;
        layouts.length = 0;

        if (!msg.callbacks) return [ent];

        var btnCount = msg.callbacks.length;

        if (btnCount > 1){
            var
            com = ent.getComponent(name),
            win = ent.getComponent(com.win),
            gs2 = win.gridSize * 2,
            rect = ent.getComponent(win.box),
            rectW = rect.width,
            rectH = rect.height,
            btnW = this.tileWidth*3, btnH = this.tileHeight,
            gap, x, y;

            gap = Math.floor((rectW - btnW * btnCount - gs2*2)/(btnCount-1));
            y = rect.y + rect.height - gs2 - btnH;
            for(var i=0; i<btnCount; i++){
                layouts.push([rect.x + gs2 + i * (btnW+gap), y, btnW, btnH]);
            }
        }

        return [ent];
    };

    me.close = function(elapsed, evt, entities){
        var e = me.findMyFirstEntity(entities, name);
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
        win = ent.getComponent(com.win),
        gs2 = win.gridSize * 2,
        rect = ent.getComponent(win.box),
        rectW = rect.width,
        tw = this.tileWidth,
        th = this.tileHeight,
        x = rect.x + gs2,
        y = rect.y + gs2,
        info = msg.info,
        labels = msg.labels,
        i, l;

        ctx.save();
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.font = com.font;
        ctx.fillStyle = com.fontColor;
        for(i=0, l=info.length; i<l; i++){
            y = me.fillWrapText(ctx, info[i], x, y, rectW, th);
            //ctx.fillText(info[i], x, y+th*i, rectW);
        }
        // draw buttons
        me.drawButtons(ctx, layouts, labels, com.fontColor, G_COLOR_TONE[2], G_COLOR_TONE[1]);

        ctx.restore();
    };
});
