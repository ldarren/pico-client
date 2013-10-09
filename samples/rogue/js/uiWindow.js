pico.def('uiWindow', 'picUIWindow', function(){

    this.use('picRenderer');
    this.use('camera');
    this.use('info');
    this.use('dialogMsg');
    this.use('trade');

    var
    me = this,
    Floor = Math.floor, Ceil = Math.ceil, Round = Math.round, Random = Math.random,
    playerId = G_WIN_ID.PLAYER,
    tomeId = G_WIN_ID.TOME,
    bagId = G_WIN_ID.BAG,
    infoId = G_WIN_ID.INFO,
    dialogId = G_WIN_ID.DIALOG,
    tradeId = G_WIN_ID.TRADE,
    name = me.moduleName;

    me.create = function(ent, data){
        var
        ts = this.tileSet,
        theme = data.theme,
        b = theme.BORDERS;

        data.active = false;
        data.maximized = 0;
        var gs = data.gridSize = this.smallDevice ? 8 : 16;
        data.layouts = [];

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
        }

        if (!ts.getPatternImg(b.TOP)){
            ts.assignPatternImg(b.TOP, ts.cut(b.TOP, gs, gs));
            ts.assignPatternImg(b.LEFT, ts.cut(b.LEFT, gs, gs));
            ts.assignPatternImg(b.BOTTOM, ts.cut(b.BOTTOM, gs, gs));
            ts.assignPatternImg(b.RIGHT, ts.cut(b.RIGHT, gs, gs));
        }

        return data;
    };

    me.resize = function(elapsed, evt, entities){
        var com, e, gs, boxName, boxCom, layouts, layout;

        for(var i=0, l=entities.length; i<l; i++){
            e = entities[i];
            com = e.getComponent(name);
            if (!com) continue;

            gs = com.gridSize;
            layouts = com.layouts;
            boxName = com.box;
            boxCom = e.getComponent(boxName);

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
            }
            // maximized layout
            layouts.push(me.fitIntoGrid([evt[0]+1, evt[1]+1, evt[2]-2, evt[3]-2], gs, gs, true));

            layout = layouts[com.maximized];

            boxCom.x = layout[0];
            boxCom.y = layout[1];
            boxCom.width = layout[2];
            boxCom.height = layout[3];
        }
        return entities;
    };

    me.checkBound = function(elapsed, evt, entities){
        var
        x = evt[0], y = evt[1],
        unknowns = [],
        e, active, uiOpt, rectOpt;

        for (var i=0, l=entities.length; i<l; i++){
            e = entities[i];
            uiOpt = e.getComponent(name);
            if (!uiOpt) {
                unknowns.push(e);
                continue;
            }
            rectOpt = e.getComponent(uiOpt.box);
            active = (rectOpt.x < x && (rectOpt.x + rectOpt.width) > x && rectOpt.y < y && (rectOpt.y + rectOpt.height) > y);
            if (active !== uiOpt.active){
                uiOpt.active = active;
            }
            if (active) {return [e]};
        }

        return unknowns;
    };

    me.showAll = function(elapsed, evt, entities){
        this.route('fingerDown', this.getRoute('fingerDownFull'));
        this.route('fingerUp', this.getRoute('fingerUpFull'));

        this.showEntity(playerId);
        this.showEntity(tomeId);
        this.showEntity(bagId);
        me.info.openIfValid.call(this, elapsed, evt, entities);
        me.dialogMsg.openIfValid.call(this, elapsed, evt, entities);
        me.trade.openIfValid.call(this, elapsed, evt, entities);
        //this.showEntity('camera');

        return entities;
    };

    me.hideAll = function(elapsed, evt, entities){
        var
        e = entities[0],
        ename = e ? e.name : "",
        downPath = [],
        upPath = [this.useSelected, this.releaseSelected];

        switch(ename){
            case playerId:
                downPath.push(me.checkBound);
                upPath.push(me.click);
                break;
            case tomeId:
                downPath.push(me.checkBound);
                //upPath.push(me.tome.click);
                upPath.push(me.click);
                break;
            case bagId:
                downPath.push(me.checkBound);
                //upPath.push(me.bag.click);
                upPath.push(me.click);
                break;
            case infoId:
                downPath.push(me.info.checkBound);
                upPath.push(me.info.click);
                break;
            case dialogId:
                downPath.push(me.dialogMsg.checkBound);
                upPath.push(me.dialogMsg.click);
                break;
            case tradeId:
                downPath.push(me.trade.checkBound);
                upPath.push(me.trade.click);
                break;
            case 'camera':
                downPath.push(me.camera.checkBound);
                upPath.push(me.camera.click);
                break;
        }

        downPath.push(this.captureSelected);
        downPath.push(me.picRenderer.captureScreenshot);
        upPath.push(me.picRenderer.draw);

        this.route('fingerUp', upPath);
        this.route('fingerDown', downPath);

        if (playerId !== ename) this.hideEntity(playerId);
        if (tomeId !== ename) this.hideEntity(tomeId);
        if (bagId !== ename) this.hideEntity(bagId);
        if (infoId !== ename) this.hideEntity(infoId);
        if (dialogId !== ename) this.hideEntity(dialogId);
        if (tradeId !== ename) this.hideEntity(tradeId);
        //this.hideEntity('camera');

        return entities;
    };

    me.click = function(elapsed, evt, entities){
        var
        e = entities[0],
        uiOpt = e.getComponent(name);

        if (!uiOpt) return entities;

        var
        x = evt[0], y = evt[1],
        rectOpt = e.getComponent(uiOpt.box);

        uiOpt.maximized = uiOpt.maximized ? 0 : 1;
        if (uiOpt.maximized){
            me.hideAll.call(this, elapsed, evt, entities);
        }else{
            me.showAll.call(this, elapsed, evt, entities);
        }
        var layout = uiOpt.layouts[uiOpt.maximized];
        rectOpt.x = layout[0];
        rectOpt.y = layout[1];
        rectOpt.width = layout[2];
        rectOpt.height = layout[3];

        return entities;
    };

    me.openForSale = function(elapsed, evt, entities){
        var ent = me.findHost(entities, G_WIN_ID.BAG);
        if (!ent) return entities;
        var
        ret = [ent],
        com = ent.getComponent(name),
        rect = ent.getComponent(com.box);

        com.maximized = 1;

        var layout = com.layouts[com.maximized];

        me.hideAll.call(this, elapsed, evt, ret);

        rect.x = layout[0];
        rect.y = layout[1];
        rect.width = layout[2];
        rect.height = layout[3];

        return ret;
    };

    me.swipe = function(elapsed, evt, entities){
        return entities;
    };

    me.draw = function(ctx, ent, clip){
        var uiOpt = ent.getComponent(name);

        if (!uiOpt) return;

        var
        gs = uiOpt.gridSize,
        rectOpt = ent.getComponent(uiOpt.box),
        ts = this.tileSet,
        dock = uiOpt.docks[uiOpt.maximized],
        borders = uiOpt.theme.BORDERS,
        theme = uiOpt.active ? uiOpt.theme.ACTIVE : uiOpt.theme.INACTIVE;

        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = uiOpt.background;
        if (uiOpt.maximized) ctx.fillRect(clip[0], clip[1], clip[2], clip[3]);
        else ctx.fillRect(rectOpt.x, rectOpt.y, rectOpt.width, rectOpt.height);

        if (dock & 8) ts.fillPattern(ctx, borders.TOP, rectOpt.x, rectOpt.y, rectOpt.width, gs);
        if (dock & 4) ts.fillPattern(ctx, borders.RIGHT, rectOpt.x + rectOpt.width - gs, rectOpt.y, gs, rectOpt.height);
        if (dock & 2) ts.fillPattern(ctx, borders.BOTTOM, rectOpt.x, rectOpt.y+rectOpt.height-gs, rectOpt.width, gs);
        if (dock & 1) ts.fillPattern(ctx, borders.LEFT, rectOpt.x, rectOpt.y, gs, rectOpt.height);

        if (9 === (dock & 9)) ts.draw(ctx, theme.TOP_LEFT, rectOpt.x, rectOpt.y, gs, gs);
        if (12 === (dock & 12)) ts.draw(ctx, theme.TOP_RIGHT, rectOpt.x + rectOpt.width - gs, rectOpt.y, gs, gs);
        if (3 === (dock & 3)) ts.draw(ctx, theme.BOTTOM_LEFT, rectOpt.x, rectOpt.y + rectOpt.height - gs, gs, gs);
        if (6 === (dock & 6)) ts.draw(ctx, theme.BOTTOM_RIGHT, rectOpt.x + rectOpt.width - gs, rectOpt.y + rectOpt.height - gs, gs, gs);

        ctx.restore();

    };
});
