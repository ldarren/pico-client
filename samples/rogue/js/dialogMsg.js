pico.def('dialogMsg', 'picUIContent', function(){
    var
    me = this,
    Floor = Math.floor, Ceil = Math.ceil, Min = Math.min, Max = Math.max, Round = Math.round, Random = Math.random,
    name = me.moduleName,
    msg,
    onCustomBound = function(ent, rect, ui, scale){
        return me.calcUIRect(rect, ui);
    },
    onCustomDraw = function(ent, ctx, rect, ui, tss, scale){
        if (!me.isValid()) return;

        var
        ts = tss['default'],
        id=ui.userData.id;

        if ('number' === typeof id){
            me.drawButton(ctx, ts, msg.labels[id], rect, scale, '#d7e894', '#204631');
        }else{
            var info = msg.info;

            me.fillIconText(ctx, ts, info[id.charAt(4)], rect, scale);
        }
    },
    onCustomButton = function(ent, ctx, rect, ui, tss, scale){
        var ts = tss['default'];
        me.drawButton(ctx, ts, msg.labels[ui.userData.id], rect, scale, '#204631', '#d7e894', '#aec440', 3);
    },
    onCustomClick = function(ent, ui){
        var
        i = 0,
        ret = false;

        if (ui){
            i = ui.userData.id;
            this.go('hideDialog'); // only hide when click on button
        }

        var route = msg.callbacks[i];

        if (route){
            ret = true;
            this.go(route, msg.events ? msg.events[i] : undefined);
        }

        return ret;
    },
    onCustomUI = function(){
        switch(Array.prototype.shift.call(arguments)){
        case me.CUSTOM_BOUND: return onCustomBound.apply(this, arguments);
        case me.CUSTOM_DRAW: return onCustomDraw.apply(this, arguments);
        case me.CUSTOM_CLICK: return onCustomClick.apply(this, arguments);
        case me.CUSTOM_BUTTON: return onCustomButton.apply(this, arguments);
        }
        return false;
    };

    me.create = function(ent, data){
        data = me.base.create.call(this, ent, data);

        data.font = this.smallDevice ? data.fontSmall : data.fontBig;
        return data;
    };

    me.show = function(ent, com, evt){
        msg = evt;
    };

    me.hide = function(ent, com, evt){
        if (undefined === evt) return;
        msg = undefined;
    };

    me.isValid = function(){
        return undefined !== msg;
    };

    me.resize = function(ent, width, height){
        var
        com = ent.getComponent(name),
        style = {font:com.font, fillStyle:com.fontColor},
        meshui = me.createMeshUI(null, me.TOP_LEFT, me.TOP_LEFT, 0, width, height, style),
        rows = meshui.rows,
        labels = msg.labels,
        // measurement start
        info = msg.info,
        l = info.length,
        cvs = document.createElement('canvas'),
        ctx = cvs.getContext('2d'),
        ts = this.tileSet,
        scale = this.smallDevice ? 1 : 2,
        textH = 14*scale, // TODO: use actual font height
        rowH = textH * 2,
        actualH = textH * (l+2), // 2 for buttons
        infoH, dummyRows,
        // measurement end
        row,cell,i,j;

        if(labels){
            row=me.createMeshRow(rows);
            for(i=0,l=labels.length; i<l; i++){
                cell=me.createMeshCell(row);
                me.createMeshCustom(cell, me.TOP, me.TOP, 0, 1, rowH, 1, 0, {id:i});
            }
        }
       
        // measurement start
        ctx.font = com.font;

        for (i=0,l=info.length; i<l; i++){
            infoH = me.fillIconText(ctx, ts, info[i], [0, 0, width, 0], scale, {textHeight: textH});
            actualH += infoH;

            dummyRows = Floor(infoH/rowH);
            dummyRows = Min(dummyRows, 6); // maximum 7 dummy rows

            row=me.createMeshRow(rows);
            cell=me.createMeshCell(row);
            me.createMeshCustom(cell, me.TOP_LEFT, me.TOP_LEFT, 0, 1, dummyRows+1, 0, 0, {id:'info'+i});

            for(j=0; j<dummyRows; j++){
                me.createMeshRow(rows);
            }
        }
        // measurement end
        meshui.h = Max(height, actualH);

        com.layout = meshui;

        return [meshui.w, meshui.h];
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

        return me.drawMeshUI.call(this, ctx, {default: this.tileSet}, ent, com, comBox, scale, onCustomUI);
    };
});
