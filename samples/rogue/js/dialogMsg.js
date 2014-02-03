pico.def('dialogMsg', 'picUIContent', function(){
    var
    me = this,
    Floor = Math.floor, Ceil = Math.ceil, Round = Math.round, Random = Math.random,
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

        switch(id){
        case 'text':
            var
            info = msg.info,
            l = info.length,
            x=rect[0],y=rect[1],w=rect[2],dh=rect[3]/l;

            for(var i=0; i<l; i++){
                me.fillIconText(ctx, ts, info[i], [x, y+dh*i, w, dh], scale);
            }
            break;
        default:
            me.drawButton(ctx, ts, msg.labels[id], rect, scale, '#d7e894', '#204631');
            break;
        }
    },
    onCustomButton = function(ent, ctx, rect, ui, tss, scale){
        var ts = tss['default'];
        me.drawButton(ctx, ts, msg.labels[ui.userData.id], rect, scale, '#204631', '#d7e894', '#aec440', 1);
    },
    onCustomClick = function(ent, ui){
        var
        i = 0,
        ret = false;

        if (ui){
            i = ui.userData.id;
        }

        var route = msg.callbacks[i];

        if (route){
            ret = true;
            this.go(route, msg.events ? msg.events[i] : undefined);
        }

        this.go('hideDialog');

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
        textHeight = 8*scale,
        rowH = textHeight * 2,
        actualHeight = textHeight * (l+2), // 2 for buttons
        dummyRows,
        // measurement end
        row,cell,i;
       
        // measurement start
        for (i=0; i<l; i++){
            actualHeight += me.fillIconText(ctx, ts, info[i], [0, 0, width, 0], scale, {textHeight: textHeight});
        }
        actualHeight = Math.max(height, actualHeight);

        dummyRows = Math.floor(actualHeight/rowH);
        dummyRows = Math.min(dummyRows, 9); // maximum 7 dummy rows
        rowH = Math.ceil(actualHeight/dummyRows);
        // measurement end

        if(labels){
            row=me.createMeshRow(rows);
            for(i=0,l=labels.length; i<l; i++){
                cell=me.createMeshCell(row);
                me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, 1, rowH, 1, 0, {id:i});
            }
        }

        dummyRows -= 2;

        row=me.createMeshRow(rows);
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.TOP_LEFT, me.TOP_LEFT, 0, 1, dummyRows, 0, 0, {id:'text'});

        for(i=0; i<dummyRows; i++){
            row=me.createMeshRow(rows);
            me.createMeshCell(row);
        }

        com.layout = meshui;

        return [width, actualHeight];
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
