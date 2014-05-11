inherit('pico/picBase');

var
Floor = Math.floor,
TYPE_TEXT=1,TYPE_TILE=2,TYPE_HIDE=3,TYPE_CUSTOM=4,TYPE_MESH=5,
WALK_REGION_START=1,WALK_REGION_END=2,WALK_ROW_START=3,WALK_ROW_END=4,WALK_CELL_START=5,WALK_CELL_END=6,WALK_UI=7,
MESH_TYPE='type',MESH_CELL_PT='cellPt',MESH_UI_PT='uiPt',MESH_PAD='pad',MESH_W='w',MESH_H='h',MESH_ROWS='rows',
MESH_BTN='button',MESH_DRAG='drag',MESH_DROP='drop',
FOCUS_BTN_UI=0,FOCUS_BTN_RECT=1,FOCUS_DRAG_UI=2,FOCUS_DRAG_RECT=3,FOCUS_DRAG_X=4,FOCUS_DRAG_Y=5,FOCUS_DRAG_DX=6,FOCUS_DRAG_DY=7,
templates = {},
setOption = function(ctx, option){
    if (!option) return;

    var keys = Object.keys(option), key;

    for(var i=0,l=keys.length; i<l; i++){
        key = keys[i];
        ctx[key] = option[key];
    }
},
// if option.w and .h bigger than outer, it means cell merging
// scale is optional
calcUIRect = function(outer, option, scale){
    scale = scale || 1;

    var
    pad = option.pad || 0,
    outerPt = option.cellPt || me.CENTER,
    innerPt = option.uiPt || me.CENTER,
    w = option.w || outer[2],
    h = option.h || outer[3],
    ow = outer[2],
    oh = outer[3],
    x,y;

    if (w < 8) {
        ow = w * ow;
        w = w * outer[2];
    }
    if (h < 8) {
        oh = h * oh;
        h = h * outer[3];
    }

    w *= scale;
    h *= scale;

    switch(outerPt){
    case me.TOP_LEFT:       x = outer[0], y = outer[1];             break;
    case me.TOP:            x = outer[0]+ow/2, y = outer[1];        break;
    case me.TOP_RIGHT:      x = outer[0]+ow, y = outer[1];          break;
    case me.LEFT:           x = outer[0], y = outer[1]+oh/2;        break;
    case me.CENTER:         x = outer[0]+ow/2, y = outer[1]+oh/2;   break;
    case me.RIGHT:          x = outer[0]+ow, y = outer[1]+oh/2;     break;
    case me.BOTTOM_LEFT:    x = outer[0], y = outer[1]+oh;          break;
    case me.BOTTOM:         x = outer[0]+ow/2, y = outer[1]+oh;     break;
    case me.BOTTOM_RIGHT:   x = outer[0]+ow, y = outer[1]+oh;       break;
    }
    switch(innerPt){
    case me.TOP_LEFT:       x = x + pad, y = y + pad;           break;
    case me.TOP:            x = x - w/2, y = y + pad;           break;
    case me.TOP_RIGHT:      x = x - w - pad, y = y + pad;       break;
    case me.LEFT:           x = x + pad, y = y - h/2;           break;
    case me.CENTER:         x = x - w/2, y = y - h/2;           break;
    case me.RIGHT:          x = x - w - pad, y = y - h/2;       break;
    case me.BOTTOM_LEFT:    x = x + pad, y = y - h - pad;       break;
    case me.BOTTOM:         x = x - w/2, y = y - h - pad;       break;
    case me.BOTTOM_RIGHT:   x = x - w - pad, y = y - h - pad;   break;
    }
    return [x, y, w, h];
},
walkMeshUI = function(rect, meshUI, cb){
    var
    inner = calcUIRect(rect, meshUI),
    rows = meshUI.rows, row, w, h,
    rl = rows.length, r,
    cellRect = [], cell, cl, c,
    uiRect,ui,u,ul,
    ret = null;

    if (rl < 2) return ret;
    h = inner[3]/(rl-1);

    if (ret = cb.call(this, WALK_REGION_START, rows, inner)) return ret;

    for(r=1; r<rl; r++){
        row = rows[r];
        cl = row.length;
        if (cl < 2) continue;
        w = inner[2]/(cl-1);
        cellRect[1] = inner[1]+h*(r-1), cellRect[2] = w, cellRect[3] = h;

        if (ret = cb.call(this, WALK_ROW_START, row)) return ret;

        for(c=1; c<cl; c++){
            cell = row[c];
            ul = cell.length;
            if (ul < 2) continue;
            cellRect[0] = inner[0]+w*(c-1);
            
            if (ret = cb.call(this, WALK_CELL_START, cell, cellRect)) return ret;
            
            for(u=1; u<ul; u++){
                ui = cell[u];
                switch(ui[MESH_TYPE]){
                case TYPE_MESH:
                    uiRect = calcUIRect(cellRect, ui);
                    if (ret = walkMeshUI.call(this, uiRect, ui)) return ret;
                    break;
                default:
                    if (ret = cb.call(this, WALK_UI, ui, cellRect)) return ret;
                    break;
                }
            }
            
            if (ret = cb.call(this, WALK_CELL_END, cell)) return ret;
        }
        if (ret = cb.call(this, WALK_ROW_END, row)) return ret;
    }
    return cb.call(this, WALK_REGION_END, rows);
},
drawMeshText = function(ctx, rect, meshText, tss, tileScale){
    var align, baseline;
    switch(meshText.uiPt){
    case me.TOP_LEFT:       align = 1, baseline = 1;break;
    case me.TOP:            align = 2, baseline = 1;break;
    case me.TOP_RIGHT:      align = 3, baseline = 1;break;
    case me.LEFT:           align = 1, baseline = 2;break;
    case me.CENTER:         align = 2, baseline = 2;break;
    case me.RIGHT:          align = 3, baseline = 2;break;
    case me.BOTTOM_LEFT:    align = 1, baseline = 3;break;
    case me.BOTTOM:         align = 2, baseline = 3;break;
    case me.BOTTOM_RIGHT:   align = 3, baseline = 3;break;
    }
    me.fillIconText(ctx, tss, meshText.text, rect, tileScale, {align:align,baseline:baseline});
},
drawMeshTile = function(ctx, rect, meshTile, tileSet, scale){
    tileSet.draw(ctx, meshTile.tileId, rect[0], rect[1], rect[2], rect[3]);
},
doButtonDown = function(focus, uiRect, ui, x, y){
    var oldUI = focus[FOCUS_BTN_UI];
    if (oldUI) oldUI.type = TYPE_CUSTOM;

    focus[FOCUS_BTN_UI] = null;

    if (ui[MESH_BTN]){
        focus[FOCUS_BTN_UI] = ui;
        focus[FOCUS_BTN_RECT] = uiRect;

        ui[MESH_TYPE] = TYPE_HIDE;
        return true;
    }
    return false;
},
doButtonUp = function(focus, uiRect, ui, x, y){
    var btnUI = focus[FOCUS_BTN_UI];

    focus[FOCUS_BTN_UI] = null;

    if (btnUI) btnUI.type = TYPE_CUSTOM;
    ui.type = TYPE_CUSTOM;

    if (btnUI && ui[MESH_BTN]){
        return btnUI === ui;
    }

    return false;
},
doPicking = function(focus, uiRect, ui, x, y){
    var oldUI = focus[FOCUS_DRAG_UI];
    if (oldUI) oldUI.type = TYPE_CUSTOM;

    focus[FOCUS_DRAG_UI] = null;

    if (ui[MESH_DRAG]){
        focus[FOCUS_DRAG_UI] = ui;
        focus[FOCUS_DRAG_RECT] = uiRect;
        focus[FOCUS_DRAG_DX] = uiRect[0] - x;
        focus[FOCUS_DRAG_DY] = uiRect[1] - y;

        ui[MESH_TYPE] = TYPE_HIDE;
        return true;
    }
    return false;
},
populateMeshUI = function(template, ui){
    var keys = Object.keys(template), key, val;
    for(var i=0,l=keys.length;i<l;i++){
        key = keys[i];
        val = template[key];
        if (MESH_ROWS === key) continue;
        ui[key] = val;
    }

    val = ui[MESH_W];
    if (!val) ui[MESH_W] = 1;
    val = ui[MESH_H];
    if (!val) ui[MESH_H] = 1;

    if (!ui[MESH_CELL_PT]) ui[MESH_CELL_PT] = me.CENTER;
    if (!ui[MESH_UI_PT]) ui[MESH_UI_PT] = me.CENTER;
    if (!ui[MESH_PAD]) ui[MESH_PAD] = 0;
    if (!ui[MESH_BTN]) ui[MESH_BTN] = 0;
    if (!ui[MESH_DRAG]) ui[MESH_DRAG] = 0;
},
copyMeshUI = function(ui, template, width, height){
    populateMeshUI(template, ui);

    var
    w = ui[MESH_W] < 8 ? ui[MESH_W] * width : ui[MESH_W],
    h = ui[MESH_H] < 8 ? ui[MESH_H] * height: ui[MESH_H];

    switch(ui[MESH_TYPE]){
    case TYPE_MESH:
        var 
        rows = template.rows,
        cells, nodes, urows, ucells, unodes,
        r, rl, c, cl, n, nl,
        rheight, cwidth;

        ui.rows = urows = [];
        urows.push(rows[0]);
        rl = rows.length;
        rheight = h/(rl-1);
        for(r=1; r<rl; r++){
            cells = rows[r];
            ucells =[];
            ucells.push(cells[0]);
            urows.push(ucells);
            cl = cells.length;
            cwidth = w/(cl-1);
            for(c=1; c<cl; c++){
                nodes = cells[c];
                unodes = [];
                ucells.push(unodes);
                for(n=0,nl=nodes.length; n<nl; n++){
                    unodes.push(copyMeshUI({}, nodes[n], cwidth, rheight));
                }
            }
        }
        break;
    }
    return ui;
};

me.calcUIRect = calcUIRect;

me.createMeshOption = function(strokeStyle, fillStyle, font, alpha, lineWidth, lineCap, lineJoin){
    return {
        font: font,
        strokeStyle: strokeStyle,
        fillStyle: fillStyle,
        globalAlpha: alpha,
        lineWidth: lineWidth,
        lineCap: lineCap,
        lineJoin: lineJoin
    };
};

me.createMeshRow = function(rows, option){
    var newRow = [option || {}];
    rows.push(newRow);
    return newRow;
};

me.createMeshCell = function(row, option){
    var cell = [option || {}];
    row.push(cell);
    return cell;
};

me.createMeshText = function(cell, cellPt, uiPt, pad, width, height, text){
    var ui = {
        type: TYPE_TEXT,
        cellPt: cellPt,
        uiPt: uiPt,
        pad: pad,
        w: width,
        h: height,
        text: text,
    };
    populateMeshUI({}, ui);
    cell.push(ui);
    return ui;
};

me.createMeshTile = function(cell, cellPt, uiPt, pad, width, height, tileSet, tileId){
    var ui = {
        type: TYPE_TILE,
        cellPt: cellPt,
        uiPt: uiPt,
        pad: pad,
        w: width,
        h: height,
        tileSet: tileSet,
        tileId: tileId
    };
    populateMeshUI({}, ui);
    cell.push(ui);
    return ui;
};

me.createMeshCustom = function(cell, cellPt, uiPt, pad, width, height, button, drag, userData){
    var ui = {
        type: TYPE_CUSTOM,
        cellPt: cellPt,
        uiPt: uiPt,
        pad: pad,
        w: width,
        h: height,
        button: button,
        drag: drag,
        userData: userData
    };
    populateMeshUI({}, ui);
    cell.push(ui);
    return ui;
};

me.createMeshUI = function(cell, cellPt, uiPt, pad, width, height, option){
    var ui = {
        type: TYPE_MESH,
        cellPt: cellPt,
        uiPt: uiPt,
        pad: pad,
        w: width,
        h: height,
        rows: [option || {}]
    };
    populateMeshUI({}, ui);
    if (cell){
        cell.push(ui);
    }
    return ui;
};

me.loadMeshUITemplates = function(path, cb){
    pico.ajax('get', path, null, {}, function(err, xhr){
        if (err) return cb(err);
        if (4 === xhr.readyState){
            try{ templates = JSON.parse(xhr.responseText); }
            catch(ex){ return cb(ex); }
            cb(null, templates);
        }
    });
};

me.createMeshUIFromTemplate = function(name, width, height){
    var 
    template = templates[name],
    ui = copyMeshUI({}, template, width, height);
    return ui;
};

me.drawMeshUI = function(ctx, tileSets, ent, com, comBox, scale, cb){
    //always start from 0,0 not rect.x, rect.y. it will be offset in uiWindow
    var
    rect = [0, 0, comBox.width, comBox.height],
    meshUI = com.layout,
    focus = com.focus,
    font = com.font,
    opt, cellRect, ui, uiRect;
    walkMeshUI.call(this, rect, meshUI, function(type){
        switch(type){
        case WALK_REGION_START:
            opt = arguments[1][0];
            if (!font) font = opt.font;
            opt.font = font;
            ctx.save();
            setOption(ctx, opt);
            break;
        case WALK_REGION_END:
            ctx.restore();
            break;
        case WALK_ROW_START:
            opt = arguments[1][0];
            ctx.save();
            setOption(ctx, opt);
            break;
        case WALK_ROW_END:
            ctx.restore();
            break;
        case WALK_CELL_START:
            opt = arguments[1][0];
            ctx.save();
            setOption(ctx, opt);
//ctx.fillStyle = 'rgb('+Floor(Math.random()*256)+','+Floor(Math.random()*256)+','+Floor(Math.random()*256)+')';
//ctx.fillRect(cellRect[0], cellRect[1], cellRect[2], cellRect[3]);
            break;
        case WALK_CELL_END:
            ctx.restore();
            break;
        case WALK_UI:
//ctx.beginPath();
            ui = arguments[1];
            cellRect = arguments[2];
            switch(ui[MESH_TYPE]){
            case TYPE_HIDE:
                if (ui === focus[FOCUS_BTN_UI]){
                    uiRect = focus[FOCUS_BTN_RECT];
                    cb.call(this, me.CUSTOM_BUTTON, ent, ctx, uiRect, ui, tileSets, scale);
                }
                break;
            case TYPE_TEXT:
//ctx.fillStyle = 'red';
//ctx.strokeStyle = 'red';
                uiRect = calcUIRect(cellRect, ui);
                drawMeshText.call(this, ctx, uiRect, ui, tileSets, scale);
                break;
            case TYPE_TILE:
//ctx.fillStyle = 'white';
//ctx.strokeStyle = 'white';
                uiRect = calcUIRect(cellRect, ui, scale);
                drawMeshTile.call(this, ctx, uiRect, ui, tileSets[ui.tileSet || 0], scale);
                break;
            case TYPE_CUSTOM:
//ctx.fillStyle = 'blue';
//ctx.strokeStyle = 'blue';
                uiRect = cb.call(this, me.CUSTOM_BOUND, ent, cellRect, ui, scale);
                cb.call(this, me.CUSTOM_DRAW, ent, ctx, uiRect, ui, tileSets, scale);
                break;
            }
//ctx.arc(uiRect[0], uiRect[1], 2, 0, 2 * Math.PI, false);
//ctx.fill();
//ctx.rect(uiRect[0], uiRect[1], uiRect[2], uiRect[3]);
//ctx.stroke();
            break;
        }
    });
    // HACK, drag item need to draw ontop of all others, text could be a problem
    if (ui = focus[FOCUS_DRAG_UI]){
        uiRect = focus[FOCUS_DRAG_RECT];
        cb.call(
            this,
            me.CUSTOM_DRAW,
            ent,
            ctx,
            [focus[FOCUS_DRAG_X], focus[FOCUS_DRAG_Y], uiRect[2], uiRect[3]],
            ui,
            tileSets,
            scale);
    }
};

/*
 * return ui if click on object, null if click on empty area, false if it was an invalid click
 */
me.clickMeshUI = function(x, y, state, ent, com, comBox, scale, cb){
    //always start from 0,0 not comBox.x, comBox.y. it will be offset in uiWindow
    var
    rect = [0, 0, comBox.width, comBox.height],
    meshUI = com.layout,
    focus = com.focus,
    ret = false,
    cellRect, uiRect, ui;

    ret = walkMeshUI.call(this, rect, meshUI, function(type){
        switch(type){
        case WALK_UI:
            ret = null;
            ui = arguments[1];
            cellRect = arguments[2];
            switch(ui[MESH_TYPE]){
            case TYPE_HIDE:
            case TYPE_CUSTOM:
                uiRect = cb.call(this, me.CUSTOM_BOUND, ent, cellRect, ui, scale);
                if (x > uiRect[0] && x < uiRect[0]+uiRect[2] && y > uiRect[1] && y < uiRect[1]+uiRect[3]){
                    if (state){
                        ret = doButtonDown(focus, uiRect, ui, x, y);
                    }else{
                        ret = doButtonUp(focus, uiRect, ui, x, y);
                        if (ret) cb.call(this, me.CUSTOM_CLICK, ent, ui);
                    }
                }
                break;
            }
            break;
        }
        return ret; // return true to stop looping
    });
    if (!ret && !state) cb.call(this, me.CUSTOM_CLICK, ent, null); // click on window, some app might need to handle that
    return ret;
};

me.pickMeshUI = function(x, y, ent, com, comBox, scale, cb){
    var
    rect = [0, 0, comBox.width, comBox.height],
    meshUI = com.layout,
    focus = com.focus,
    cellRect, uiRect, ui;
    
    return walkMeshUI.call(this, rect, meshUI, function(type){
        switch(type){
        case WALK_UI:
            ui = arguments[1];
            cellRect = arguments[2];
            switch(ui[MESH_TYPE]){
            case TYPE_HIDE:
            case TYPE_CUSTOM:
                uiRect = cb.call(this, me.CUSTOM_BOUND, ent, cellRect, ui, scale);
                if (x > uiRect[0] && x < uiRect[0]+uiRect[2] && y > uiRect[1] && y < uiRect[1]+uiRect[3]){
                    return doPicking(focus, uiRect, ui, x, y);
                }
                break;
            }
            break;
        }
        return false;
    });
};

me.dragMeshUI = function(x, y, ent, com, comBox, scale, cb){
    var
    focus = com.focus,
    btn = focus[FOCUS_BTN_UI],
    ui = focus[FOCUS_DRAG_UI];

    if (!ui) return false;

    if (btn){
        focus[FOCUS_BTN_UI] = null;
        if (btn !== ui) btn.type = TYPE_CUSTOM;
    }
    focus[FOCUS_DRAG_X] = x + focus[FOCUS_DRAG_DX];
    focus[FOCUS_DRAG_Y] = y + focus[FOCUS_DRAG_DY];
    return true;
};

me.dropMeshUI = function(x, y, ent, com, comBox, scale, cb){
    var
    rect = [0, 0, comBox.width, comBox.height],
    meshUI = com.layout,
    focus = com.focus,
    cell, cellRect, ui;
    
    return walkMeshUI.call(this, rect, meshUI, function(type){
        switch(type){
        case WALK_CELL_START:
            cell = arguments[1];
            cellRect = arguments[2];
            if (x > cellRect[0] && x < cellRect[0]+cellRect[2] && y > cellRect[1] && y < cellRect[1]+cellRect[3]){
                // reset button
                ui = focus[FOCUS_BTN_UI];
                if (ui) ui.type = TYPE_CUSTOM;
                focus[FOCUS_BTN_UI] = null;

                ui = focus[FOCUS_DRAG_UI];
                if (ui) ui.type = TYPE_CUSTOM;
                focus[FOCUS_DRAG_UI] = null;

                if (ui && cell[0][MESH_DROP]){
                    cb.call(this, me.CUSTOM_DROP, ent, ui, cell);
                    return true;
                }
            }
            break;
        }
        return false;
    });
};

me.generateGridLayout = function(rect, itemWidth, itemHeight, rowCount, colCount){
    colCount = colCount || 1;
    rowCount = rowCount || 1;

    var
    layout = [],
    dx = (colCount < 2) ? 0 : (rect[2] - (colCount * itemWidth))/(colCount-1),
    dy = (rowCount < 2) ? 0 : (rect[3] - (rowCount * itemHeight))/(rowCount-1),
    x = rect[0], y,
    i, j;

    for(i=0; i<colCount; i++){
        y = rect[1];
        for(j=0; j<rowCount; j++){
            layout.push([x, y]);
            y+=itemHeight+dy;
        }
        x+=itemWidth+dx;
    }

    return layout;
};

me.fillWrapText = function(ctx, text, x, y, maxWidth, lineHeight){
    var metrics;

    for(var s=0,i=0,j=0; -1 !== j; i=j+1) {
        j = text.indexOf(' ', i);

        if (-1 === j){
            ctx.fillText(text.substring(s), x, y);
            break;
        }

        metrics = ctx.measureText(text.substring(s, j+1));

        if (metrics.width > maxWidth) {
            ctx.fillText(text.substring(s, i), x, y);
            s = i;
            y += lineHeight;
        }
    }
    return y;
};

// options.align: 0=left,1=center,2=right
// options.baseline: 0=top,1=center,2=bottom
// options.padX: padding x
// options.symbol: text to replace by icon
me.fillIconText = function(ctx, tss, text, rect, scale, options){
    var
    align = 2,
    baseline = 2,
    padX = 0, padY = 0,
    symbol = '`',
    lineWords = [],
    lineLens = [],
    lineSheets = [],
    words = [],word,
    lens = [],len,lineW=0,lineH=0,
    sheets = [],sheet=null,
    lastWord=false,
    x=rect[0], y=rect[1], width=rect[2], height=rect[3],
    metrics,k,l,offX,offY,dim,iconOff;

    if (options){
        align = options.align || align;
        baseline = options.baseline || baseline;
        padX = options.padX || padX;
        padY = options.padY || padY;
        symbol = options.symbol || symbol;
        scale = scale || 1;
        if (options.font) ctx.font = options.font;
        if (options.textHeight) lineH = options.textHeight * 1.5;
    }

    ctx.save();
    ctx.textAlign = 'left';
    switch(baseline){
    case 1: //top
        ctx.textBaseline = 'top';
        iconOff = 0;
        break;
    case 3: // bottom
        ctx.textBaseline = 'bottom';
        iconOff = 1;
        break;
    default: // middle
        ctx.textBaseline = 'middle';
        iconOff = 0.5;
        break;
    }

    text = text.toString();

    for(var i=0,j=0; -1 !== j;) {
        j = text.indexOf(' ', i);
        lastWord = j < 0;
        if (symbol === text.charAt(i)){
            word = lastWord ? text.substr(i) : text.substring(i, j);
            i = j;
            sheet = tss[word[1]];
            word = word.substr(2);
            dim = sheet.getDimension(word);
            len = dim[2] * scale;
        }else{
            word = lastWord ? text.substr(i) : text.substring(i, j + 1);
            i = j + 1;
            metrics = ctx.measureText(word);
            len = metrics.width;
            sheet = null;
        }
        if (len > width) break; // width too small
        if (lineW + len >= width || lastWord){
            if (lastWord && lineW + len <= width){
                words.push(word);
                lens.push(len);
                sheets.push(sheet);
            }

            lineWords.push(words.slice());
            lineLens.push(lens.slice());
            lineSheets.push(sheets.slice());

            // edge case, last and exceeded line width
            if (lastWord){
                if (lineW + len > width){
                    lineWords.push([word]);
                    lineLens.push([len]);
                    lineSheets.push([sheet]);
                }
                break;
            }

            lineW = 0;
            words.length = 0;
            lens.length = 0;
            sheets.length = 0;
        }
        lineW += len;
        words.push(word);
        lens.push(len);
        sheets.push(sheet);
    }

    if (!lineWords.length) return;
    if (!lineH) lineH = height/lineWords.length;

    for(i=0,j=lineWords.length; i<j; i++){
        words = lineWords[i];
        lens = lineLens[i];
        sheets = lineSheets[i];
        lineW = lens.reduce(function(accu, val){return accu+val});

        switch(align){
        case 1: offX = x + padX; break;
        case 3: offX = x + width - padX - lineW; break;
        default: offX = x + padX + Floor((width- lineW)/2); break;
        }
        switch(baseline){
        case 1: offY = y + padY + (lineH * i); break;
        case 3: offY = y + padY + (lineH * i) + lineH; break;
        default: offY = y + padY + (lineH * i) + lineH/2; break;
        }

        for(k=0,l=words.length; k<l; k++){
            word=words[k];
            sheet=sheets[k];
            if (sheet){
                dim = sheet.getDimension(word);
                sheet.draw(ctx, word, offX, offY - ((dim[3]*scale)*iconOff), dim[2]*scale, dim[3]*scale);
            }else{
                ctx.fillText(word, offX, offY);
            }
            offX += lens[k];
        }
        
    }
    ctx.restore();
    return offY+lineH;
};

me.drawButton = function(ctx, tss, label, rect, scale, fontColor, faceColor, borderColor, baseline){
    ctx.fillStyle = faceColor;
    ctx.strokeStyle = borderColor || faceColor;
    ctx.fillRect.apply(ctx, rect);
    ctx.strokeRect.apply(ctx, rect);
    ctx.fillStyle = fontColor;
    me.fillIconText(ctx, tss, label, rect, scale, {baseline: baseline});
};

/******* virtual methods ******/

me.create = function(ent, data){
    data.focus = [];
    data.layout = [];
    return data;
};

me.resize = function(bound){
    // place holder
    return bound;
};

me.pick = function(ent, x, y){
    // place holder
    return false;
};

me.drag = function(ent, x, y){
    // place holder
    return false;
};

me.drop = function(ent, x, y){
    // place holder
    return false;
};

me.click = function(ent, evt, state){
    // place holder
    return false;
};

me.draw = function(ctx, ent, clip){
    // place holder
};

me.drawScreenshot = function(ctx, ent, clip, bitmap){
    // place holder
};

Object.defineProperties(me, {
    TOP_LEFT:   {value:3, writable:false, configurable:false, enumerable:true},
    TOP:        {value:1, writable:false, configurable:false, enumerable:true},
    TOP_RIGHT:  {value:5, writable:false, configurable:false, enumerable:true},
    LEFT:       {value:2, writable:false, configurable:false, enumerable:true},
    CENTER:     {value:16, writable:false, configurable:false, enumerable:true},
    RIGHT:      {value:4, writable:false, configurable:false, enumerable:true},
    BOTTOM_LEFT:{value:10, writable:false, configurable:false, enumerable:true},
    BOTTOM:     {value:8, writable:false, configurable:false, enumerable:true},
    BOTTOM_RIGHT:{value:12, writable:false, configurable:false, enumerable:true},

    CUSTOM_BOUND: {value:1, writable:false, configurable:false, enumerable:true},
    CUSTOM_DRAW:  {value:2, writable:false, configurable:false, enumerable:true},
    CUSTOM_CLICK: {value:3, writable:false, configurable:false, enumerable:true},
    CUSTOM_BUTTON: {value:4, writable:false, configurable:false, enumerable:true},
    CUSTOM_DROP: {value:5, writable:false, configurable:false, enumerable:true}});
