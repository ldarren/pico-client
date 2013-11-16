pico.def('uiWindow', 'picUIWindow', function(){

    this.use('picRenderer');
    this.use('camera');
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
    refreshContent = function(com, comBox, layout){
        comBox.x = layout[0];
        comBox.y = layout[1];
        comBox.width = layout[2];
        comBox.height = layout[3];

        var
        canvas = com.canvas,
        mod = pico.getModule(com.content),
        bound = mod.resize.call(this, layout);

        canvas.setAttribute('width', bound[2]);
        canvas.setAttribute('height', bound[3]);

        mod.draw.call(this, canvas.getContext('2d'), e, bound);
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
        var com, e, gs, layouts;

        for(var i=0, l=entities.length; i<l; i++){
            e = entities[i];
            com = e.getComponent(name);
            if (!com) continue;

            gs = com.gridSize;
            layouts = com.layouts;

            layouts.length = 0;

            switch(e.name){
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
            }
            // maximized layout
            if (com.resizable)
                layouts.push(me.fitIntoGrid([evt[0]+1, evt[1]+1, evt[2]-2, evt[3]-2], gs, gs, true));

            refreshContent(com, e.getComponent(com.box), layouts[com.maximized]);
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
        e, active, com, comBox;

        for (var i=0, l=entities.length; i<l; i++){
            e = entities[i];
            com = e.getComponent(name);
            if (!com) {
                unknowns.push(e);
                continue;
            }
            comBox = e.getComponent(com.box);
            active = (comBox.x < x && (comBox.x + comBox.width) > x && comBox.y < y && (comBox.y + comBox.height) > y);
            if (active !== com.active){
                com.active = active;
            }
            if (active) selected.push(e);
        }

        if (selected.length) return selected;

        return unknowns;
    };

    me.click = function(elapsed, evt, entities){
        var
        e = entities[0], // should had 1 entity only
        com = e.getComponent(name);

        if (!com) return entities;

        var mod = pico.getModule(com.content);
        if (!mod.click.call(this, ent, evt) && com.resizable){
            com.maximized = com.maximized ? 0 : 1;
            if (com.maximized){
                me.hideAll.call(this, elapsed, evt, entities);
                this.showEntity(e.name);
            }else{
                me.showAll.call(this, elapsed, evt, entities);
            }
        }
        refreshContent(com, e.getComponent(com.box), com.layouts[com.maximized]);
        return entities;
    };

    me.maximise = function(elapsed, evt, entities){
        var ent = me.findHost(entities, evt[0]);
        if (!ent) return entities;

        me.hideAll.call(this, elapsed, evt, ret);
        me.showEntity(ent.name);

        var
        ret = [ent],
        com = ent.getComponent(name);

        com.maximized = com.resizable ? 1 : 0;

        refreshContent(com, e.getComponent(com.box), com.layouts[com.maximized]);

        return ret;
    };

    me.swipe = function(elapsed, evt, entities){
        return entities;
    };

    me.draw = function(ctx, ent, clip){
        var com = ent.getComponent(name);

        if (!com) return;

        var
        gs = com.gridSize,
        gs2 = gs * 2,
        bound = [comBox.x + gs, comBox.y + gs, comBox.width - gs, comBox.height = gs],
        comBox = ent.getComponent(com.box);

        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = com.background;
        if (com.maximized) ctx.fillRect(clip[0], clip[1], clip[2], clip[3]);
        else ctx.fillRect(comBox.x, comBox.y, comBox.width, comBox.height);

        ctx.drawImage(com.canvas, com.scrollX, com.scrollY, bound[2], bound[3], bound[0], bound[1], bound[2], bound[3]);

        if (com.theme){
            var
            ts = this.tileSet,
            dock = com.docks[com.maximized],
            borders = com.theme.BORDERS,
            theme = com.active ? com.theme.ACTIVE : com.theme.INACTIVE;

            if (dock & 8) ts.fillPattern(ctx, borders.TOP, comBox.x, comBox.y, comBox.width, gs);
            if (dock & 4) ts.fillPattern(ctx, borders.RIGHT, comBox.x + comBox.width - gs, comBox.y, gs, comBox.height);
            if (dock & 2) ts.fillPattern(ctx, borders.BOTTOM, comBox.x, comBox.y+comBox.height-gs, comBox.width, gs);
            if (dock & 1) ts.fillPattern(ctx, borders.LEFT, comBox.x, comBox.y, gs, comBox.height);

            if (9 === (dock & 9)) ts.draw(ctx, theme.TOP_LEFT, comBox.x, comBox.y, gs, gs);
            if (12 === (dock & 12)) ts.draw(ctx, theme.TOP_RIGHT, comBox.x + comBox.width - gs, comBox.y, gs, gs);
            if (3 === (dock & 3)) ts.draw(ctx, theme.BOTTOM_LEFT, comBox.x, comBox.y + comBox.height - gs, gs, gs);
            if (6 === (dock & 6)) ts.draw(ctx, theme.BOTTOM_RIGHT, comBox.x + comBox.width - gs, comBox.y + comBox.height - gs, gs, gs);
        }

        ctx.restore();
    };
});
