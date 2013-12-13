pico.def('tome', 'picUIContent', function(){
    var
    me = this,
    Floor = Math.floor, Ceil = Math.ceil, Random = Math.random, Round = Math.random,
    TOME_ROW = 4,
    name = me.moduleName,
    tomeId = G_WIN_ID.TOME;

    me.onCalcMeshUICustom = function(rect, ui, tileScale){
        return me.calcUIRect(rect, ui, tileScale);
    };
    me.onDrawMeshUICustom = function(ctx, rect, ui, ts, tileScale){
    /*    var
        selectedSpell = this.hero.getSelectedSpell(),
        items = this.hero.getTome(),
        j = ui.userData.id,
        item, x, y;

        item = items[j];
        if (!item) return;
        ts.draw(ctx, item[OBJECT_ICON], rect[0], rect[1], rect[2], rect[3]);
        if (item[SPELL_COOLDOWN]) ts.draw(ctx, G_NUMERIC.LARGE_LIGHT + item[SPELL_COOLDOWN], rect[0], rect[1], rect[2], rect[3]);
        else if (item === selectedSpell) ts.draw(ctx, G_SHADE[0], rect[0], rect[1], rect[2], rect[3]);*/
    };
    me.onClickMeshUI = function(ctx, rect, ui){
        console.log('tome click'+JSON.stringify(ui));
        spell = this.hero.getTome()[ui.userData.id];
        this.go('selectSpell', this.hero.getSelectedSpell() === spell ? undefined : spell); // call even if tome[j-1] is undefined
        return;
    };

    me.create = function(ent, data){
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
                me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, size, size, {id:0+(i*4)});
                cell=me.createMeshCell(row);
                me.createMeshTile(cell, me.CENTER, me.CENTER, 0, size, size, 'default', G_UI.SLOT);
                me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, size, size, {id:1+(i*4)});
                cell=me.createMeshCell(row);
                me.createMeshTile(cell, me.CENTER, me.CENTER, 0, size, size, 'default', G_UI.SLOT);
                me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, size, size, {id:2+(i*4)});
                cell=me.createMeshCell(row);
                me.createMeshTile(cell, me.CENTER, me.CENTER, 0, size, size, 'default', G_UI.SLOT);
                me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, size, size, {id:4+(i*4)});
                cell=me.createMeshCell(row);
                cell=me.createMeshCell(row);
            }
        }else{
            for(i=0;i<cap;i++){
                row=me.createMeshRow(rows);
                cell=me.createMeshCell(row);
                me.createMeshTile(cell, me.CENTER, me.CENTER, 0, size, size, 'default', G_UI.SLOT);
                me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, size, size, {id:i});
            }
        }
        com.layout = meshui;

        return [com.layout.w, com.layout.h];
    };

    me.click = function(ent, x, y, state){
        var
        com = ent.getComponent(name),
        comBox = ent.getComponent(com.box);

        return me.clickMeshUI(x, y, state, comBox, com.layout);
    };

    // use this so that all entities can be updated
    me.selectSpell = function(elapsed, evt, entities){
        var e, com;

        for(var i=0,l=entities.length; i<l; i++){
            e = entities[i];
            com = e.getComponent(name);
            if (!com) continue;

            this.hero.selectSpell(evt);

            return entities;
        }
    };

    me.draw = function(ctx, ent, clip){
        var
        com = ent.getComponent(name),
        win = ent.getComponent(com.win),
        rect = ent.getComponent(com.box),
        scale = this.smallDevice ? 1 : 2;

        return me.drawMeshUI(ctx, rect, com.layout, {default: this.tileSet}, scale, com.font);
    };
});
