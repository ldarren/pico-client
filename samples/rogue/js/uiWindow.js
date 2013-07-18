pico.def('uiWindow', 'picUIWindow', function(){

    this.use('info');

    var
    me = this,
    playerId = G_WIN_ID.PLAYER,
    skillsId = G_WIN_ID.SKILLS,
    inventoryId = G_WIN_ID.BAG,
    infoId = G_WIN_ID.INFO,
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
                data.docks = [8+4+1, 8+4+2+1];
                data.minWidth = this.smallDevice ? 320 : 640;
                data.minHeight = this.tileHeight;
                break;
            case skillsId:
                data.docks = [8+2+1, 8+4+2+1];
                data.minWidth = this.tileWidth;
                data.minHeight = this.smallDevice ? 180 : 360;
                break;
            case inventoryId:
                data.docks = [8+4+2, 8+4+2+1];
                data.minWidth = this.tileWidth;
                data.minHeight = this.smallDevice ? 180 : 360;
                break;
            case infoId:
                data.docks = [4+2+1, 8+4+2+1];
                data.minWidth = this.smallDevice ? 320 : 640;
                data.minHeight = this.tileHeight+16;
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
                        [evt[0] + Math.floor((evt[2] - com.minWidth)/2), evt[1] + evt[3] - com.minHeight, com.minWidth, com.minHeight],
                        gs, gs, false));
                    break;
                case skillsId:
                    layouts.push(me.fitIntoGrid(
                        [evt[0] + evt[2] - com.minWidth, evt[1] + Math.floor((evt[3] - com.minHeight)/2), com.minWidth, com.minHeight],
                        gs, gs, false));
                    break;
                case inventoryId:
                    layouts.push(me.fitIntoGrid(
                        [evt[0], evt[1] + Math.floor((evt[3] - com.minHeight)/2), com.minWidth, com.minHeight],
                        gs, gs, false));
                    break;
                case infoId:
                    layouts.push(me.fitIntoGrid(
                        [evt[0] + Math.floor((evt[2] - com.minWidth)/2), evt[1], com.minWidth, com.minHeight],
                        gs, gs, false));
                    break;
            }
            layouts.push(me.fitIntoGrid([evt[0]+1, evt[1]+1, evt[2]-2, evt[3]-2], gs, gs, true));

            layout = layouts[com.maximized];

            boxCom.x = layout[0];
            boxCom.y = layout[1];
            boxCom.width = layout[2];
            boxCom.height = layout[3];
        }
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
                if (uiOpt.maximized){
                    if (playerId !== e.name) this.hideEntity(playerId);
                    if (skillsId !== e.name) this.hideEntity(skillsId);
                    if (inventoryId !== e.name) this.hideEntity(inventoryId);
                    if (infoId !== e.name) this.hideEntity(infoId);
                    this.hideEntity('camera');
                }else{
                    this.showEntity(playerId);
                    this.showEntity(skillsId);
                    this.showEntity(inventoryId);
                    me.info.openIfValid.call(this);
                    this.showEntity('camera');
                }
                var layout = uiOpt.layouts[uiOpt.maximized];
                rectOpt.x = layout[0];
                rectOpt.y = layout[1];
                rectOpt.width = layout[2];
                rectOpt.height = layout[3];
                return [e];
            }
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
        dock = uiOpt.docks[uiOpt.maximized],
        borders = uiOpt.theme.BORDERS,
        theme;

        if (uiOpt.active){
            theme = uiOpt.theme.ACTIVE;
        }else{
            theme = uiOpt.theme.INACTIVE;
        }

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
