pico.def('tome', 'picUIContent', function(){
    var
    me = this,
    Floor = Math.floor, Ceil = Math.ceil, Random = Math.random, Round = Math.round, Max = Math.max,
    TOME_ROW = 4,
    name = me.moduleName,
    tomeId = G_WIN_ID.TOME,
    onCustomBound = function(ent, rect, ui, scale){
        return me.calcUIRect(rect, ui, scale);
    },
    onCustomDraw = function(ent, ctx, rect, ui, tss, scale){
        var
        ts = tss[0],
        ss = tss[1],
        items = this.hero.getTome(),
        x=rect[0],y=rect[1],w=rect[2],h=rect[3],
        crop = scale * 4,
        cropLength = scale * 24,
        item;

        item = items[ui.userData.id];
        if (!item) return;
        // crop spell image to show slot frame
        ss.draw(ctx, item[OBJECT_ICON], x+crop, y+crop, cropLength, cropLength, 4, 4, 24, 24);
        if (item[SPELL_COOLDOWN]) me.fillIconText(ctx, tss, item[SPELL_COOLDOWN], rect, scale);
        else if (item === this.hero.getSelectedSpell()) ts.draw(ctx, G_UI.SELECTED, x, y, w, h);
    },
    onCustomClick = function(ent, ui){
        if (!ui) return false;
        var
        id = ui.userData.id,
        hero = this.hero,
        spell = hero.getTome()[id],
        toggle = hero.getSelectedSpell() === spell;

        hero.selectSpell(toggle ? undefined : spell);
        spell = hero.getSelectedSpell();
        if (spell){
            var
            labels=['Select a cell', 'Forget', 'Close'],
            callbacks=['showDialog', 'showDialog'],
            events=[
                {info:['Tab a cell to cast','You can cast the selected spell directly by tapping on a cell on ground'], labels:['Close'], callbacks:[]},
                {info:['Forget spell','This will remove the selected spell permanently from tome'], labels:['Forget', 'Close'], callbacks:['forgetSpell']}];

            switch(spell[OBJECT_SUB_TYPE]){
            case G_SPELL_TYPE.WHIRLWIND:
            case G_SPELL_TYPE.POISON_BLADE:
            case G_SPELL_TYPE.SQUEAL:
            case G_SPELL_TYPE.NOCTURNAL:
            case G_SPELL_TYPE.LYCAN:
            case G_SPELL_TYPE.GROWL:
                labels[0] = 'Cast';
                callbacks[0] = 'castSpell';
                events[0] = null;
                break;
            case G_SPELL_TYPE.GAZE:
            case G_SPELL_TYPE.FIREBALL:
                break;
            }
            this.go('showInfo', {targetId: id, labels: labels, callbacks: callbacks, events: events, context:G_CONTEXT.TOME});
            return true;
        }
        
        this.go('hideInfo');
        return false;
    },
    onCustomDrop = function(ent, ui, cell){
        var
        sourceId = ui.userData.id,
        items = this.hero.getTome(),
        item, targetId;

        item = items[sourceId];
        if (!item) return false;

        targetId = cell[2].userData.id;
        items[sourceId] = items[targetId];
        items[targetId] = item;
        return true;
    },
    onCustomUI = function(){
        if (!this.mortal) return;
        switch(Array.prototype.shift.call(arguments)){
        case me.CUSTOM_BOUND: return onCustomBound.apply(this, arguments); break;
        case me.CUSTOM_DRAW: return onCustomDraw.apply(this, arguments); break;
        case me.CUSTOM_CLICK: return onCustomClick.apply(this, arguments); break;
        case me.CUSTOM_BUTTON: return onCustomDraw.apply(this, arguments); break;
        case me.CUSTOM_DROP: return onCustomDrop.apply(this, arguments); break;
        }
    };

    me.createEffect = function(type, level, period, icon){
        var efx;

        switch(type){
        case G_EFFECT_TYPE.BURNED:      efx = G_CREATE_OBJECT(G_ICON.EFX_BURNED);       break;
        case G_EFFECT_TYPE.CURSED:      efx = G_CREATE_OBJECT(G_ICON.EFX_CURSED);       break;
        case G_EFFECT_TYPE.DISEASED:    efx = G_CREATE_OBJECT(G_ICON.EFX_DISEASED);     break;
        case G_EFFECT_TYPE.FEARED:      efx = G_CREATE_OBJECT(G_ICON.EFX_FEARED);       break;
        case G_EFFECT_TYPE.FROZEN:      efx = G_CREATE_OBJECT(G_ICON.EFX_FROZEN);       break;
        case G_EFFECT_TYPE.POISONED:    efx = G_CREATE_OBJECT(G_ICON.EFX_POISONED);     break;
        case G_EFFECT_TYPE.POISON_BLADE:efx = G_CREATE_OBJECT(G_ICON.EFX_POISON_BLADE); break;
        case G_EFFECT_TYPE.SQUEAL:      efx = G_CREATE_OBJECT(G_ICON.EFX_SQUEAL);       break;
        case G_EFFECT_TYPE.NOCTURNAL:   efx = G_CREATE_OBJECT(G_ICON.EFX_NOCTURNAL);    break;
        case G_EFFECT_TYPE.LYCAN:       efx = G_CREATE_OBJECT(G_ICON.EFX_LYCAN);        break;
        case G_EFFECT_TYPE.GROWL:       efx = G_CREATE_OBJECT(G_ICON.EFX_GROWL);        break;
        }

        if (icon) efx[OBJECT_ICON] = icon;
        if (level) efx[OBJECT_LEVEL] = level;

        efx[EFFECT_PERIOD] = period || -1;

        return efx;
    };

    me.create = function(ent, data){
        data = me.base.create.call(this, ent, data);

        data.font = this.smallDevice ? data.fontSmall : data.fontBig;
        return data;
    };

    me.resize = function(ent, width, height){
        var
        com = ent.getComponent(name),
        comWin = ent.getComponent(com.win),
        cap = this.hero.getTomeCap(),
        style = {font: com.font,fillStyle:com.fontColor},
        cellOpt = {drop: 1},
        size = 32,
        actualSize = this.smallDevice ? size : size*2,
        meshui,rows,row,cell,i,l;

        if (comWin.maximized){
            meshui = me.createMeshUI(null, me.TOP_LEFT, me.TOP_LEFT, 0, width, Max(height, actualSize * 4), style);
            rows=meshui.rows;
        }else{
            meshui = me.createMeshUI(null, me.TOP_LEFT, me.TOP_LEFT, 0, width, Max(height, actualSize * 9), style);
            rows=meshui.rows;
        }

        row=me.createMeshRow(rows);
        cell=me.createMeshCell(row);
        me.createMeshText(cell, me.CENTER, me.CENTER, 0, 1, 1, com.name);

        if (comWin.maximized){
            for(i=0,l=cap/4;i<l;i++){
                row=me.createMeshRow(rows);
                cell=me.createMeshCell(row, cellOpt);
                cell=me.createMeshCell(row, cellOpt);
                cell=me.createMeshCell(row, cellOpt);
                me.createMeshTile(cell, me.CENTER, me.CENTER, 0, size, size, 0, G_UI.SLOT);
                me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, size, size, 1, 1, {id:0+(i*4)});
                cell=me.createMeshCell(row, cellOpt);
                me.createMeshTile(cell, me.CENTER, me.CENTER, 0, size, size, 0, G_UI.SLOT);
                me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, size, size, 1, 1, {id:1+(i*4)});
                cell=me.createMeshCell(row, cellOpt);
                me.createMeshTile(cell, me.CENTER, me.CENTER, 0, size, size, 0, G_UI.SLOT);
                me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, size, size, 1, 1, {id:2+(i*4)});
                cell=me.createMeshCell(row, cellOpt);
                me.createMeshTile(cell, me.CENTER, me.CENTER, 0, size, size, 0, G_UI.SLOT);
                me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, size, size, 1, 1, {id:3+(i*4)});
                cell=me.createMeshCell(row, cellOpt);
                cell=me.createMeshCell(row, cellOpt);
            }
        }else{
            for(i=0;i<cap;i++){
                row=me.createMeshRow(rows);
                cell=me.createMeshCell(row, cellOpt);
                me.createMeshTile(cell, me.CENTER, me.CENTER, 0, size, size, 0, G_UI.SLOT);
                me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, size, size, 1, 0, {id:i});
            }
        }
        com.layout = meshui;

        return [meshui.w, meshui.h];
    };

    me.pick = function(ent, x, y){
        var
        com = ent.getComponent(name),
        comBox = ent.getComponent(com.box),
        scale = this.smallDevice ? 1 : 2;

        return me.pickMeshUI.call(this, x, y, ent, com, comBox, scale, onCustomUI);
    };

    me.drag = function(ent, x, y){
        var
        com = ent.getComponent(name),
        comBox = ent.getComponent(com.box),
        scale = this.smallDevice ? 1 : 2;

        return me.dragMeshUI.call(this, x, y, ent, com, comBox, scale, onCustomUI);
    };

    me.drop = function(ent, x, y){
        var
        com = ent.getComponent(name),
        comBox = ent.getComponent(com.box),
        scale = this.smallDevice ? 1 : 2;

        return me.dropMeshUI.call(this, x, y, ent, com, comBox, scale, onCustomUI);
    };

    me.click = function(ent, x, y, state){
        var
        com = ent.getComponent(name),
        comBox = ent.getComponent(com.box),
        scale = this.smallDevice ? 1 : 2;

        return me.clickMeshUI.call(this, x, y, state, ent, com, comBox, scale, onCustomUI);
    };

    me.draw = function(ctx, ent, clip){
        var
        com = ent.getComponent(name),
        comBox = ent.getComponent(com.box),
        scale = this.smallDevice ? 1 : 2;

        return me.drawMeshUI.call(this, ctx, [this.tileSet, this.spellSet], ent, com, comBox, scale, onCustomUI);
    };
});
