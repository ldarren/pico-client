pico.def('dialogMsg', 'picUIContent', function(){
    var
    me = this,
    Floor = Math.floor, Ceil = Math.ceil, Round = Math.round, Random = Math.random,
    name = me.moduleName,
    msg,
    onCustomBound = function(ent, rect, ui, scale){
        return me.calcUIRect(rect, ui);
    },
    onCustomDraw = function(ent, ctx, rect, ui, ts, scale){
        if (!me.isValid()) return;

        var id=ui.userData.id;
        switch(id){
        case 'text':
            var
            info = msg.info,
            l = info.length,
            x=rect[0],y=rect[1],w=rect[2],dh = rect[3]/l;

            for(var i=0,l=info.length; i<l; i++){
                me.fillIconText(ctx, ts, info[i], [x, y+dh*i, w, dh], scale);
            }
            break;
        default:
            me.drawButton(ctx, rect, msg.labels[id], '#d7e894', '#204631');
            break;
        }
    },
    onCustomButton = function(ent, ctx, rect, ui, ts, scale){
        me.drawButton(ctx, rect, msg.labels[ui.userData.id], '#204631', '#d7e894', '#aec440', 'top');
    },
    onCustomClick = function(ent, ui){
        if (!ui){
            this.go('hideDialog');
            return false;
        }

        var
        i = ui.userData.id,
        route = msg.callbacks[i];

        if (route){
            this.go(route, msg.evt);
        }

        this.go('hideDialog');

        return true;
    },
    onCustomUI = function(){
        switch(Array.prototype.shift.call(arguments)){
        case me.CUSTOM_BOUND: return onCustomBound.apply(this, arguments); break;
        case me.CUSTOM_DRAW: return onCustomDraw.apply(this, arguments); break;
        case me.CUSTOM_CLICK: return onCustomClick.apply(this, arguments); break;
        case me.CUSTOM_BUTTON: return onCustomButton.apply(this, arguments); break;
        }
        return false;
    };

    me.create = function(ent, data){
        data = me.base.create.call(this, ent, data);

        data.font = this.smallDevice ? data.fontSmall : data.fontBig;
        return data;
    };

    me.open = function(ent, evt){
        msg = evt;
    };

    me.close = function(){
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
        row,cell,i;

        if(labels){
            row=me.createMeshRow(rows);
            for(var i=0,l=labels.length; i<l; i++){
                cell=me.createMeshCell(row);
                me.createMeshCustom(cell, me.CENTER, me.CENTER, 0, 1, 1, 1, 0, {id:i});
            }
        }

        row=me.createMeshRow(rows);
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.TOP_LEFT, me.TOP_LEFT, 0, 1, 3, 0, 0, {id:'text'});

        row=me.createMeshRow(rows);
        cell=me.createMeshCell(row);

        row=me.createMeshRow(rows);
        cell=me.createMeshCell(row);

        com.layout = meshui;

        return [width, height];
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
