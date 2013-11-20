pico.def('uiWindow', 'picUIWindow', function(){

    this.use('picRenderer');
    this.use('info');
    this.use('dialogMsg');
    this.use('trade');

    var
    Floor = Math.floor, Ceil = Math.ceil, Round = Math.round, Random = Math.random,
    playerId = G_WIN_ID.PLAYER,
    tomeId = G_WIN_ID.TOME,
    bagId = G_WIN_ID.BAG,
    infoId = G_WIN_ID.INFO,
    dialogId = G_WIN_ID.DIALOG,
    tradeId = G_WIN_ID.TRADE,
    me = this,
    name = me.moduleName,
    refreshContent = function(ent, com){
        var
        comBox  = ent.getComponent(com.box),
        layout = com.layouts[com.maximized],
        canvas = com.canvas,
        mod = pico.getModule(com.content);

        com.contentSize = mod.resize.call(this, ent, comBox.width, comBox.height);

        canvas.setAttribute('width', com.contentSize[0]);
        canvas.setAttribute('height', com.contentSize[1]);

        mod.draw.call(this, canvas.getContext('2d'), ent, layout);
    },
    resizeContent = function(ent, com){
        var
        comBox = ent.getComponent(com.box),
        layouts = com.layouts,
        gs = com.gridSize, gs2 = gs*2,
        layout;

        if (com.maximized){
            layout = layouts[1];
            switch(ent.name){
                case playerId:
                case tomeId:
                case bagId:
                    comBox.x = gs;
                    comBox.y = gs;
                    comBox.width = layout[2]-(gs2);
                    comBox.height = layout[3]-(gs2);
                    break;
                case infoId:
                case dialogMsgId:
                case tradeId:
                    comBox.x = 0;
                    comBox.y = 0;
                    comBox.width = layout[2];
                    comBox.height = layout[3];
                    break;
            }
        }else{
            layout = layouts[0];
            switch(ent.name){
                case playerId:
                    comBox.x = gs;
                    comBox.y = 0;
                    comBox.width = layout[2]-gs2;
                    comBox.height = layout[3]-gs;
                    break;
                case tomeId:
                    comBox.x = gs;
                    comBox.y = gs;
                    comBox.width = layout[2]-gs;
                    comBox.height = layout[3]-gs2;
                    break;
                case bagId:
                    comBox.x = 0;
                    comBox.y = gs;
                    comBox.width = layout[2]-gs;
                    comBox.height = layout[3]-gs2;
                    break;
                case infoId:
                case dialogMsgId:
                case tradeId:
                    comBox.x = 0;
                    comBox.y = 0;
                    comBox.width = layout[2];
                    comBox.height = layout[3];
                    break;
            }
        }

        refreshContent.call(this, ent, com);
    };

    me.create = function(ent, data){
        data = me.base.create.call(this, ent, data);

        var gs = data.gridSize = this.smallDevice ? 8 : 16;

        switch(ent.name){
            case playerId:
                data.docks = [4+2+1, 8+4+2+1];
                data.minWidth = this.smallDevice ? 320 : 640;
                data.minHeight = this.tileHeight+gs;
                break;
            case tomeId:
                data.docks = [8+2+1, 8+4+2+1];
                data.minWidth = this.tileWidth+gs;
                data.minHeight = this.smallDevice ? 180 : 360;
                break;
            case bagId:
                data.docks = [8+4+2, 8+4+2+1];
                data.minWidth = this.tileWidth+gs;
                data.minHeight = this.smallDevice ? 180 : 360;
                break;
            case infoId:
                data.minHeight = this.smallDevice ? 80 : 160;
                break;
            case dialogId:
                data.minWidth = this.smallDevice ? 320 : 640;
                data.minHeight = this.smallDevice ? 180 : 360;
                break;
            case tradeId:
                data.minWidth = this.smallDevice ? 320 : 640;
                data.minHeight = this.smallDevice ? 180 : 360;
                break;
        }

        if (data.theme){
            var
            ts = this.tileSet,
            theme = data.theme,
            b = theme.BORDERS;

            if (!ts.getPatternImg(b.TOP)){
                ts.assignPatternImg(b.TOP, ts.cut(b.TOP, gs, gs));
                ts.assignPatternImg(b.LEFT, ts.cut(b.LEFT, gs, gs));
                ts.assignPatternImg(b.BOTTOM, ts.cut(b.BOTTOM, gs, gs));
                ts.assignPatternImg(b.RIGHT, ts.cut(b.RIGHT, gs, gs));
            }
        }

        return data;
    };

    me.resize = function(elapsed, evt, entities){
        var com, comBox, ent, gs, layouts;

        for(var i=0, l=entities.length; i<l; i++){
            ent = entities[i];
            com = ent.getComponent(name);
            if (!com) continue;

            gs = com.gridSize;
            layouts = com.layouts;

            layouts.length = 0;

            switch(ent.name){
                case playerId:
                    layouts.push(me.fitIntoGrid(
                        [evt[0] + Floor((evt[2] - com.minWidth)/2), evt[1], com.minWidth, com.minHeight],
                        gs, gs, false));
                    break;
                case tomeId:
                    layouts.push(me.fitIntoGrid(
                        [evt[0] + evt[2] - com.minWidth, evt[1] + Floor((evt[3] - com.minHeight)/2), com.minWidth, com.minHeight],
                        gs, gs, false));
                    break;
                case bagId:
                    layouts.push(me.fitIntoGrid(
                        [evt[0], evt[1] + Floor((evt[3] - com.minHeight)/2), com.minWidth, com.minHeight],
                        gs, gs, false));
                    break;
                case infoId:
                    layouts.push([evt[0], evt[1]+evt[3]-com.minHeight, evt[2], com.minHeight]);
                    break;
                case dialogMsgId:
                case tradeId:
                    layouts.push(me.fitIntoGrid(
                        [evt[0] + Ceil((evt[2] - com.minWidth)/2), evt[1] + Ceil((evt[3] - com.minHeight)/2), com.minWidth, com.minHeight],
                        gs, gs, false));
                    break;
            }
            // maximized layout
            if (com.resizable)
                layouts.push(me.fitIntoGrid([evt[0]+1, evt[1]+1, evt[2]-2, evt[3]-2], gs, gs, true));

            resizeContent.call(this, ent, com);
        }
        return entities;
    };

    me.showAll = function(elapsed, evt, entities){
        this.showEntity(playerId);
        this.showEntity(tomeId);
        this.showEntity(bagId);
        me.info.openIfValid.call(this, elapsed, evt, entities);
        me.dialogMsg.openIfValid.call(this, elapsed, evt, entities);
        me.trade.openIfValid.call(this, elapsed, evt, entities);

        return entities;
    };

    me.hideAll = function(elapsed, evt, entities){
        this.hideEntity(playerId);
        this.hideEntity(tomeId);
        this.hideEntity(bagId);
        this.hideEntity(infoId);
        this.hideEntity(dialogId);
        this.hideEntity(tradeId);

        return entities;
    };

    me.checkBound = function(elapsed, evt, entities){
        var
        x = evt[0], y = evt[1],
        unknowns = [], selected = [],
        ent, active, com, layout;

        for (var i=0, l=entities.length; i<l; i++){
            ent = entities[i];
            com = ent.getComponent(name);
            if (!com) {
                unknowns.push(ent);
                continue;
            }
            layout = com.layouts[com.maximized];
            active = (layout[0] < x && (layout[0]+layout[2]) > x && layout[1] < y && (layout[1]+layout[3]) > y);
            if (active !== com.active){
                com.active = active;
            }
            if (active){
                selected.push(ent);
                var mod = pico.getModule(com.content);
                mod.click.call(this, ent, com.scrollX + x, com.scrollY + y, 1);
            }
        }

        if (selected.length) return selected;

        return unknowns;
    };

    me.click = function(elapsed, evt, entities){
        var
        ent = entities[0], // should had 1 entity only
        com = ent.getComponent(name);

        if (!com) return entities;

        var mod = pico.getModule(com.content);
        if (!mod.click.call(this, ent, com.scrollX + evt[0], com.scrollY + evt[1], 0) && com.resizable){
            com.maximized = com.maximized ? 0 : 1;
            if (com.maximized){
                me.hideAll.call(this, elapsed, evt, entities);
                this.showEntity(ent.name);
            }else{
                me.showAll.call(this, elapsed, evt, entities);
            }
        }
        refreshContent.call(this, ent, com);
        return entities;
    };

    me.maximized = function(elapsed, evt, entities){
        var ent = me.findHost(entities, evt[0]);
        if (!ent) return entities;

        me.hideAll.call(this, elapsed, evt, ret);
        me.showEntity(ent.name);

        var
        ret = [ent],
        com = ent.getComponent(name);

        com.maximized = com.resizable ? 1 : 0;

        resizeContent.call(this, com, ent);

        return ret;
    };

    me.swipe = function(elapsed, evt, entities){
        var
        ent = entities[0],
        com = ent.getComponent(name),
        contentSize = com.contentSize,
        comBox = ent.getComponent(com.box);

        if (contentSize[0] > comBox.width){
            scrollX += evt[0];
        }
        if (contentSize[1] > comBox.height){
            scrollY += evt[1];
        }

        return entities;
    };

    me.draw = function(ctx, ent, clip){
        var com = ent.getComponent(name);
        if (!com) return;

        var
        layout = com.layouts[com.maximized],
        gs = com.gridSize,
        gs2 = gs * 2,
        comBox = ent.getComponent(com.box);

        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = com.background;
        if (com.maximized) ctx.fillRect(clip[0], clip[1], clip[2], clip[3]);
        else ctx.fillRect(layout[0], layout[1], layout[2], layout[3]);

        ctx.drawImage(com.canvas,
            com.scrollX, com.scrollY, comBox.width, comBox.height,
            layout[0]+comBox.x, layout[1]+comBox.y, layout[2], layout[3]);

        if (com.theme){
            var
            ts = this.tileSet,
            dock = com.docks[com.maximized],
            borders = com.theme.BORDERS,
            theme = com.active ? com.theme.ACTIVE : com.theme.INACTIVE;

            if (dock & 8) ts.fillPattern(ctx, borders.TOP, layout[0], layout[1], layout[2], gs);
            if (dock & 4) ts.fillPattern(ctx, borders.RIGHT, layout[0] + layout[2] - gs, layout[1], gs, layout[3]);
            if (dock & 2) ts.fillPattern(ctx, borders.BOTTOM, layout[0], layout[1]+layout[3]-gs, layout[2], gs);
            if (dock & 1) ts.fillPattern(ctx, borders.LEFT, layout[0], layout[1], gs, layout[3]);

            if (9 === (dock & 9)) ts.draw(ctx, theme.TOP_LEFT, layout[0], layout[1], gs, gs);
            if (12 === (dock & 12)) ts.draw(ctx, theme.TOP_RIGHT, layout[0] + layout[2] - gs, layout[1], gs, gs);
            if (3 === (dock & 3)) ts.draw(ctx, theme.BOTTOM_LEFT, layout[0], layout[1] + layout[3] - gs, gs, gs);
            if (6 === (dock & 6)) ts.draw(ctx, theme.BOTTOM_RIGHT, layout[0] + layout[2] - gs, layout[1] + layout[3] - gs, gs, gs);
        }

        ctx.restore();
    };
});
