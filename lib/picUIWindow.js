pico.def('picUIWindow', 'picBase', function(){
    var me = this;

    me.create = function(ent, data){
        if (!data.content) console.error(me.moduleName, 'create component without content');
        if (!data.box) console.error(me.moduleName, 'create component without box');

        return {
            content: data.content,
            contentSize: [0,0],
            box: data.box,
            background: data.background || '#000',
            resizable: data.resizable || false,
            active: false,
            maximized: 0,
            layouts: [],
            docks: [],
            minWidth: 128,
            minHeight: 128,
            theme: data.theme, // optional
            gridSize: 8,
            canvas: document.createElement('canvas'),
            scrollX: 0,
            scrollY: 0,
        };
    };

    me.fitIntoGrid = function(rect, gzX, gzY, smaller){
        var
        roundTL = smaller ? Math.ceil : Math.floor,
        roundBR = smaller ? Math.floor : Math.ceil,
        t = rect[1],
        l = rect[0],
        r = l + rect[2],
        b = t + rect[3];

        t = roundTL(t / gzY)*gzY;
        l = roundTL(l / gzX)*gzX;
        b = roundBR(b / gzY)*gzY;
        r = roundBR(r / gzX)*gzX;

        rect[0] = l;
        rect[1] = t;
        rect[2] = r - l;
        rect[3] = b - t;
        return rect;
    };

    me.draw = function(ctx, ent, clip){
        // place holder
    };

    me.drawScreenshot = function(ctx, ent, clip, bitmap){
        // place holder
    };
});

pico.def('picUIContent', 'picBase', function(){

    Object.defineProperty(this, 'TOP_LEFT',   {value:3, writable:false, configurable:false, enuthisrable:true});
    Object.defineProperty(this, 'TOP',        {value:1, writable:false, configurable:false, enuthisrable:true});
    Object.defineProperty(this, 'TOP_RIGHT',  {value:5, writable:false, configurable:false, enuthisrable:true});
    Object.defineProperty(this, 'LEFT',       {value:2, writable:false, configurable:false, enuthisrable:true});
    Object.defineProperty(this, 'CENTER',     {value:16, writable:false, configurable:false, enuthisrable:true});
    Object.defineProperty(this, 'RIGHT',      {value:4, writable:false, configurable:false, enuthisrable:true});
    Object.defineProperty(this, 'BOTTOM_LEFT',{value:10, writable:false, configurable:false, enuthisrable:true});
    Object.defineProperty(this, 'BOTTOM',     {value:8, writable:false, configurable:false, enuthisrable:true});
    Object.defineProperty(this, 'BOTTOM_RIGHT',{value:12, writable:false, configurable:false, enuthisrable:true});

    Object.defineProperty(this, 'TYPE_TEXT',      {value:1, writable:false, configurable:false, enuthisrable:true});
    Object.defineProperty(this, 'TYPE_TILE',      {value:2, writable:false, configurable:false, enuthisrable:true});
    Object.defineProperty(this, 'TYPE_BUTTON',    {value:3, writable:false, configurable:false, enuthisrable:true});
    Object.defineProperty(this, 'TYPE_CUSTOM',    {value:4, writable:false, configurable:false, enuthisrable:true});
    Object.defineProperty(this, 'TYPE_MESH',    {value:5, writable:false, configurable:false, enuthisrable:true});

    var
    me = this,
    templates = {},
    setOption = function(ctx, option){
        if (!option) return;

        var keys = Object.keys(option), key;

        for(var i=0,l=keys.length; i<l; i++){
            key = keys[i];
            ctx[key] = option[key];
        }
    },
    setInner = function(outer, option){
        var
        w = option.w || outer[2],
        h = option.h || outer[3],
        pad = option.pad || 0,
        outerPt = option.cellPt || me.CENTER,
        innerPt = option.uiPt || me.CENTER,
        x,y;

        switch(outerPt){
            case me.TOP_LEFT:       x = outer[0], y = outer[1];                         break;
            case me.TOP:            x = outer[0] + outer[2]/2, y = outer[1];            break;
            case me.TOP_RIGHT:      x = outer[0] + outer[2], y = outer[1];              break;
            case me.LEFT:           x = outer[0], y = outer[1]+outer[3]/2;              break;
            case me.CENTER:         x = outer[0]+outer[2]/2, y = outer[1]+outer[3]/2;   break;
            case me.RIGHT:          x = outer[0]+outer[2], y = outer[1]+outer[3]/2;     break;
            case me.BOTTOM_LEFT:    x = outer[0], y = outer[1]+outer[3];                break;
            case me.BOTTOM:         x = outer[0]+outer[2]/2, y = outer[1]+outer[3];     break;
            case me.BOTTOM_RIGHT:   x = outer[0]+outer[2], y = outer[1]+outer[3];       break;
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
    drawMeshRow = function(ctx, rect, cells){
        var
        l = cells.length-1,
        i, w;

        if (l < 1) return;
        w = rect[2]/l;

        ctx.save();
        setOption(ctx, cells[0]);
        for(i=1,l=cells.length; i<l; i++){
            drawMeshCell.call(this, ctx, [rect[0]+w*(i-1), rect[1], w, rect[3]], cells[i]);
        }
        ctx.restore();
    },
    drawMeshCell = function(ctx, rect, uis){
        var
        l = uis.length-1,
        i, ui;

        if (l < 1) return;

        ctx.save();
        setOption(ctx, uis[0]);
        for(i=1,l=uis.length; i<l; i++){
            ui = uis[i];
            switch(ui.type){
                case me.TYPE_TEXT:
                    drawMeshText.call(this, ctx, rect, ui);
                    break;
                case me.TYPE_TILE:
                    drawMeshTile.call(this, ctx, rect, ui);
                    break;
                case me.TYPE_BUTTON:
                    drawMeshButton.call(this, ctx, rect, ui);
                    break;
                case me.TYPE_CUSTOM:
                    this.signal('draw', [ctx, rect, ui]);
                    break;
                case me.TYPE_MESH:
                    drawMeshUI.call(this, ctx, rect, ui);
                    break;
            }
        }
        ctx.restore();
    },
    drawMeshText = function(ctx, rect, meshText){
        var x, y, align, baseLine;
        switch(meshText.uiPt){
            case me.TOP_LEFT:
                x = rect[0], y = rect[1], align = 'left', baseLine = 'top';
                break;
            case me.TOP:
                x = rect[0]+rect[2]/2, y = rect[1], align = 'center', baseLine = 'top';
                break;
            case me.TOP_RIGHT:
                x = rect[0]+rect[2], y = rect[1], align = 'right', baseLine = 'top';
                break;
            case me.LEFT:
                x = rect[0], y = rect[1]+rect[3]/2, align = 'left', baseLine = 'middle';
                break;
            case me.CENTER:
                x = rect[0]+rect[2]/2, y = rect[1]+rect[3]/2, align = 'center', baseLine = 'middle';
                break;
            case me.RIGHT:
                x = rect[0]+rect[2], y = rect[1]+rect[3]/2, align = 'right', baseLine = 'middle';
                break;
            case me.BOTTOM_LEFT:
                x = rect[0], y = rect[1]+rect[3], align = 'left', baseLine = 'bottom';
                break;
            case me.BOTTOM:
                x = rect[0]+rect[2]/2, y = rect[1]+rect[3], align = 'center', baseLine = 'bottom';
                break;
            case me.BOTTOM_RIGHT:
                x = rect[0]+rect[2], y = rect[1]+rect[3], align = 'right', baseLine = 'bottom';
                break;
        }
        ctx.save();
        ctx.textAlign = align;
        ctx.textBaseline = baseLine;
        me.fillWrapText(ctx, meshText.text, x, y, meshText.w, meshText.h);
        ctx.restore();
    },
    drawMeshTile = function(ctx, rect, meshTile){
        var inner = setInner(rect, meshTile);

        meshTile.tileSet.draw(ctx, meshTile.tileId, inner[0], inner[1], inner[2], inner[3]);
    },
    drawMeshButton = function(ctx, rect, meshButton){
        ctx.fillRect.apply(ctx, rect);
        ctx.strokeRect.apply(ctx, rect);
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = meshButton.state? meshButton.downColor : meshButton.upColor;
        ctx.fillText(meshButton.text, rect[0]+rect[2]/2, rect[1]+rect[3]/2, rect[2]);
        ctx.restore();
    },
    drawMeshUI = function(ctx, rect, meshUI){
        var
        inner = setInner(rect, meshUI),
        rows = meshUI.rows,
        l = rows.length-1,
        h, i;

        if (l < 1) return;
        h = inner[3]/l;

        ctx.save();
        setOption(ctx, rows[0]);
        for(i=1,l=rows.length; i<l; i++){
            drawMeshRow.call(this, ctx, [inner[0], inner[1]+(h*(i-1)), inner[2], h], rows[i]);
        }
        ctx.restore();
    },
    clickMeshUI = function(x, y, state, rect, meshUI){
        var
        inner = setInner(rect, meshUI),
        rows = meshUI.rows,
        region = [],
        rl = rows.length,
        row,cell,ui,w,h,r,c,cl,u,ul;

        if (rl < 1) return false;
        h = inner[3]/(rl-1);

        for(r=1; r<rl; r++){
            row = rows[r];
            cl = row.length;
            if (cl < 1) continue;
            w = inner[2]/(cl-1);
            for(c=1; c<cl; c++){
                cell = row[c];
                region[0] = inner[0]+w*(c-1), region[1] = inner[1]+h*(r-1), region[2] = w, region[3] = h;
                for(u=1,ul=cell.length; u<ul; u++){
                    ui = cell[u];
                    switch(ui.type){
                        case me.TYPE_BUTTON:
                            ui.state = 0;
                            if (x > region[0] && x < region[0]+region[2] && y > region[1] && y < region[1]+region[3]){
                                ui.state = state;
                                if (!state) this.signal('click', [ui]);
                                return true;
                            }
                            break;
                        case me.TYPE_MESH:
                            if (clickMeshUI.call(this, x, y, state, region, ui)) return true;
                            break;
                    }
                }
            }
        }
        return false;
    },
    copyMeshUI = function(ui, template, width, height){
        var keys = Object.keys(template), key, val;
        for(var i=0,l=keys.length;i<l;i++){
            key = keys[i];
            val = template[key];
            if ('w' === key && val < 2){
                ui[key] = width * val;
                continue;
            }
            if ('h' === key && val < 2){
                ui[key] = height * val;
                continue;
            }
            if ('rows' === key) continue;
            ui[key] = val;
        }

        switch(ui.type){
            case me.TYPE_MESH:
                var 
                rows = template.rows,
                cells, nodes, urows, ucells, unodes,
                r, rl, c, cl, n, nl,
                rheight, cwidth;

                ui.rows = urows = [];
                urows.push(rows[0]);
                rl = rows.length;
                rheight = height/rl;
                for(r=1; r<rl; r++){
                    cells = rows[r];
                    ucells =[];
                    ucells.push(cells[0]);
                    urows.push(ucells);
                    cl = cells.length;
                    cwidth = width/cl;
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
    };

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
            type: me.TYPE_TEXT,
            cellPt: cellPt,
            uiPt: uiPt,
            pad: pad,
            w: width,
            h: height,
            text: text
        };
        cell.push(ui);
        return ui;
    };

    me.createMeshTile = function(cell, cellPt, uiPt, pad, width, height, tileSet, tileId){
        var ui = {
            type: me.TYPE_TILE,
            cellPt: cellPt,
            uiPt: uiPt,
            pad: pad,
            w: width,
            h: height,
            tileSet: tileSet,
            tileId: tileId
        };
        cell.push(ui);
        return ui;
    };

    me.createMeshButton = function(cell, cellPt, uiPt, pad, width, height, upColor, downColor, label, userData){
        var ui = {
            type: me.TYPE_BUTTON,
            cellPt: cellPt,
            uiPt: uiPt,
            pad: pad,
            w: width,
            h: height,
            state: 0,
            upColor: upColor,
            downColor: downColor,
            text: label,
            userData: userData
        };
        cell.push(ui);
        return ui;
    };

    me.createMeshCustom = function(cell, cellPt, uiPt, pad, width, height, userData){
        var ui = {
            type: me.TYPE_CUSTOM,
            cellPt: cellPt,
            uiPt: uiPt,
            pad: pad,
            w: width,
            h: height,
            userData: userData
        };
        cell.push(ui);
        return ui;
    };

    me.createMeshUI = function(cell, cellPt, uiPt, pad, width, height, option){
        var ui = {
            type: me.TYPE_MESH,
            cellPt: cellPt,
            uiPt: uiPt,
            pad: pad,
            w: width,
            h: height,
            rows: [option || {}]
        };
        if (cell) cell.push(ui);
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
        list;

        return copyMeshUI({}, template, width, height);
    };

    me.drawMeshUI = function(ctx, rect, meshUI){
        //always start from 0,0 not rect.x, rect.y. it will be offset in uiWindow
        drawMeshUI.call(this, ctx, [0, 0, rect.width, rect.height], meshUI);
    };

    me.clickMeshUI = function(x, y, state, rect, meshUI){
        //always start from 0,0 not rect.x, rect.y. it will be offset in uiWindow
        clickMeshUI.call(this, x, y, state, [0, 0, rect.width, rect.height], meshUI);
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

        for(var s=0,i=0,j=0; -1 !== j; i=j) {
            j = text.indexOf(' ', i+1);

            if (-1 === j){
                ctx.fillText(text.substring(s), x, y);
                y += lineHeight;
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

    // draw icon and label pair
    me.drawData = function(ctx, ts, icon, value, x, y, iconSize, margin, valueWidth){
        ts.draw(ctx, icon, x, y, iconSize, iconSize);
        x += iconSize;
        if (valueWidth){
            ctx.fillText(value, x, y + iconSize/2, valueWidth);
            x += valueWidth;
        }else{
            ctx.fillText(value, x, y + iconSize/2);
            var metrics = ctx.measureText(''+value);
            x += metrics.width + margin;
        }
        return x;
    };

    me.drawButtons = function(ctx, layouts, labels, fontColor, faceColor, borderColor){
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        var btn;
        for(var i=0, l=layouts.length; i<l; i++){
            ctx.fillStyle = faceColor;
            ctx.strokeStyle = borderColor;
            btn = layouts[i];
            ctx.fillRect.apply(ctx, btn);
            ctx.strokeRect.apply(ctx, btn);
            ctx.fillStyle = fontColor;
            ctx.fillText(labels[i], btn[0]+btn[2]/2, btn[1]+btn[3]/2, btn[2]);
        }
    };

    me.resize = function(bound){
        // place holder
        return bound;
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
});
