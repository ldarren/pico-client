pico.def('tome', 'picUIContent', function(){
    var
    me = this,
    Floor = Math.floor, Ceil = Math.ceil, Random = Math.random, Round = Math.random,
    TOME_ROW = 4,
    name = me.moduleName,
    tomeId = G_WIN_ID.TOME;

    onCustomBound = function(rect, ui, tileScale){
        return me.calcUIRect(rect, ui, tileScale);
    };
    onCustomDraw = function(ctx, rect, ui, ts, tileScale){
        var
        items = this.hero.getTome(),
        item, x, y;

        item = items[ui.userData.id];
        if (!item) return;
        ts.draw(ctx, item[OBJECT_ICON], rect[0], rect[1], rect[2], rect[3]);
        if (item[SPELL_COOLDOWN]) ts.draw(ctx, G_NUMERIC.LARGE_LIGHT + item[SPELL_COOLDOWN], rect[0], rect[1], rect[2], rect[3]);
        else if (item === this.hero.getSelectedSpell()) ts.draw(ctx, G_UI.SELECTED, rect[0], rect[1], rect[2], rect[3]);
    },
    onCustomClick = function(ui){
        var
        spell = this.hero.getTome()[ui.userData.id],
        toggle = this.hero.getSelectedSpell() === spell;

        this.hero.selectSpell(toggle ? undefined : spell);
        this.go('forceRefresh');

        return undefined !== spell;
    },
    onCustomUI = function(){
        switch(Array.prototype.shift.call(arguments)){
        case me.CUSTOM_BOUND: return onCustomBound.apply(this, arguments); break;
        case me.CUSTOM_DRAW: return onCustomDraw.apply(this, arguments); break;
        case me.CUSTOM_CLICK: return onCustomClick.apply(this, arguments); break;
        }
    };

    me.create = function(ent, data){
        data = me.base.create.call(this, ent, data);

        data.layout = [];
        data.font = this.smallDevice ? data.fontSmall : data.fontBig;
        return data;
    };

    me.resize = function(ent, width, height){
        var
        com = ent.getComponent(name),
        comWin = ent.getComponent(com.win),
        cap = this.hero.getTomeCap(),
        sd = this.smallDevice,
        style = {font: com.font,fillStyle:"#aec440"},
        size = 32,
        actualSize = sd ? 32 : 64,
        newH,meshui,rows,row,cell,i,l;

        if (comWin.maximized){
            newH = height > actualSize * 4 ? height : actualSize * 4;
            meshui = me.createMeshUI(null, me.TOP_LEFT, me.TOP_LEFT, 0, width, newH, style);
            rows=meshui.rows;
        }else{
            newH = height > actualSize * 9 ? height : actualSize * 9;
            meshui = me.createMeshUI(null, me.TOP_LEFT, me.TOP_LEFT, 0, width, newH, style);
            rows=meshui.rows;
        }

        row=me.createMeshRow(rows);
        cell=me.createMeshCell(row);
        me.createMeshText(cell, me.CENTER, me.CENTER, 0, 1, 1, com.name);

        if (comWin.maximized){
            for(i=0,l=cap/4;i<l;i++){
                row=me.createMeshRow(rows);
                cell=me.createMeshCell(row);
                cell=me.createMeshCell(row);
                cell=me.createMeshCell(row);
                me.createMeshTile(cell, me.CENTER, me.CENTER, 0, size, size, 'default', G_UI.SLOT);
                me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, size, size, 1, 1, {id:0+(i*4)});
                cell=me.createMeshCell(row);
                me.createMeshTile(cell, me.CENTER, me.CENTER, 0, size, size, 'default', G_UI.SLOT);
                me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, size, size, 1, 1, {id:1+(i*4)});
                cell=me.createMeshCell(row);
                me.createMeshTile(cell, me.CENTER, me.CENTER, 0, size, size, 'default', G_UI.SLOT);
                me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, size, size, 1, 1, {id:2+(i*4)});
                cell=me.createMeshCell(row);
                me.createMeshTile(cell, me.CENTER, me.CENTER, 0, size, size, 'default', G_UI.SLOT);
                me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, size, size, 1, 1, {id:4+(i*4)});
                cell=me.createMeshCell(row);
                cell=me.createMeshCell(row);
            }
        }else{
            for(i=0;i<cap;i++){
                row=me.createMeshRow(rows);
                cell=me.createMeshCell(row);
                me.createMeshTile(cell, me.CENTER, me.CENTER, 0, size, size, 'default', G_UI.SLOT);
                me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, size, size, 1, 0, {id:i});
            }
        }
        com.layout = meshui;

        return [com.layout.w, com.layout.h];
    };

    me.pick = function(ent, x, y){
        var
        com = ent.getComponent(name),
        comBox = ent.getComponent(com.box),
        scale = this.smallDevice ? 1 : 2;

        return me.pickMeshUI(x, y, comBox, com.layout, scale, onCustomUI);
    };

    me.drag = function(ent, x, y){
        var
        com = ent.getComponent(name),
        comBox = ent.getComponent(com.box),
        scale = this.smallDevice ? 1 : 2;

        return me.dragMeshUI(x, y, comBox, com.layout, scale, onCustomUI);
    };

    me.drop = function(ent, x, y){
        var
        com = ent.getComponent(name),
        comBox = ent.getComponent(com.box),
        scale = this.smallDevice ? 1 : 2;

        return me.dropMeshUI(x, y, comBox, com.layout, scale, onCustomUI);
    };

    me.click = function(ent, x, y, state){
        var
        com = ent.getComponent(name),
        comBox = ent.getComponent(com.box),
        scale = this.smallDevice ? 1 : 2;

        return me.clickMeshUI.call(this, x, y, state, comBox, com.layout, scale, onCustomUI);
    };

    me.draw = function(ctx, ent, clip){
        var
        com = ent.getComponent(name),
        win = ent.getComponent(com.win),
        rect = ent.getComponent(com.box),
        scale = this.smallDevice ? 1 : 2;

        return me.drawMeshUI.call(this, ctx, rect, com.layout, {default: this.tileSet}, scale, com.font, onCustomUI);
    };
});
