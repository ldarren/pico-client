inherit('pico/picUIContent');
var
Floor = Math.floor, Ceil = Math.ceil, Min = Math.min, Max = Math.max, Round = Math.round, Random = Math.random,
name = me.moduleName,
msg,
onCustomBound = function(ent, rect, ui, scale){
    return me.calcUIRect(rect, ui);
},
onCustomDraw = function(ent, ctx, rect, ui, tss, scale){
    if (!me.isValid()) return;

    var id=ui.userData.id;

    if ('number' === typeof id){
        me.drawButton(ctx, tss, msg.labels[id], rect, scale, G_COLOR_TONE[0], G_COLOR_TONE[3]);
    }else{
        var info = msg.info;

        me.fillIconText(ctx, tss, info[id.charAt(4)], rect, scale);
    }
},
onCustomButton = function(ent, ctx, rect, ui, tss, scale){
    me.drawButton(ctx, tss, msg.labels[ui.userData.id], rect, scale, G_COLOR_TONE[3], G_COLOR_TONE[0], G_COLOR_TONE[1], 3);
},
onCustomClick = function(ent, ui){
    if (!ui) return false;

    var
    i = ui.userData.id,
    route = msg.callbacks[i];

    if (route){
        this.go(route, msg.events ? msg.events[i] : undefined);
    }

    this.go('hideDialog'); // only hide when click on button

    return true;
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
    if (!evt) return;
    msg = evt;
    var labels = evt.labels || [];
    if (!labels.length){
        labels.push('Close');
        msg.labels = labels;
        msg.callbacks = msg.callbacks || [];
    }
};

me.hide = function(ent, com, evt){
    if (undefined === evt) return;
    msg = undefined;
};

me.isValid = function(){
    return undefined !== msg;
};

me.resize = function(ent, width, height){
    if (!me.isValid()) return [2,2];
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
    tss = [this.tileSet, this.spellSet, this.medalSet],
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
   
    ctx.font = com.font;

    for (i=0,l=info.length; i<l; i++){
        infoH = me.fillIconText(ctx, tss, info[i], [0, 0, width, 0], scale, {textHeight: textH});
        actualH += infoH;

        dummyRows = Floor(infoH/rowH);
        dummyRows = Min(dummyRows, 6); // maximum 7 dummy rows

        me.createMeshRow(rows); // add 1 space

        row=me.createMeshRow(rows);
        cell=me.createMeshCell(row);
        me.createMeshCustom(cell, me.TOP_LEFT, me.TOP_LEFT, 0, 1, dummyRows+1, 0, 0, {id:'info'+i});

        for(j=0; j<dummyRows-1; j++){ // minus one at the top
            me.createMeshRow(rows);
        }
    }
    if (actualH < height){
        dummyRows = Floor((height - actualH)/rowH);
        for(j=0; j<dummyRows; j++){
            me.createMeshRow(rows);
        }
        meshui.h = height;
    }else{
        meshui.h = actualH;
    }

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

    return me.drawMeshUI.call(this, ctx, [this.tileSet, this.spellSet, this.medalSet], ent, com, comBox, scale, onCustomUI);
};
