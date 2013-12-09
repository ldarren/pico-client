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
    Floor = Math.floor,
    MESH_TYPE='type',MESH_CELL_PT='cellPt',MESH_UI_PT='uiPt',MESH_PAD='pad',MESH_W='w',MESH_H='h',MESH_ROWS='rows',DEFAULT='default',
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
    setInner = function(outer, option, scale){
        var
        w = option.w || outer[2],
        h = option.h || outer[3];
        if (w < 8) w = option.w * outer[2];
        if (h < 8) h = option.h * outer[3];

        scale = scale || 1;
        w *= scale;
        h *= scale;

        if (w < outer[2] && h < outer[3]){
            var
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
        }
        return [outer[0], outer[1], w, h];
    },
    drawMeshText = function(ctx, rect, meshText, ts, tileScale){
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
        me.fillIconText(ctx, ts, meshText.text, rect[0], rect[1], rect[2], rect[3], tileScale, {align:align,baseline:baseline});
    },
    drawMeshTile = function(ctx, rect, meshTile, tileSet, tileScale){
        var inner = setInner(rect, meshTile, tileScale);

        tileSet.draw(ctx, meshTile.tileId, inner[0], inner[1], inner[2], inner[3]);
    },
    drawMeshButton = function(ctx, rect, meshButton, tileSet, tileScale){
        ctx.fillRect.apply(ctx, rect);
        ctx.strokeRect.apply(ctx, rect);
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = meshButton.state? meshButton.downColor : meshButton.upColor;
        ctx.fillText(meshButton.text, rect[0]+rect[2]/2, rect[1]+rect[3]/2, rect[2]);
        ctx.restore();
    },
    drawMeshUI = function(ctx, rect, meshUI, tileSets, tileScale, font){
        var
        inner = setInner(rect, meshUI),
        rows = meshUI.rows,
        opt = rows[0],
        rl = rows.length-1, r, rx, ry, rw, rh,
        cells,
        cl, c, cx, cy, cw, ch,
        uis,
        ul, u, rect,
        ui,
        h, w;

        if (rl < 1) return;
        h = inner[3]/rl;

        if (!font) font = opt.font;
        opt.font = font;

        ctx.save();
        setOption(ctx, rows[0]);
        for(r=1,rl=rows.length; r<rl; r++){
            cells = rows[r];
            cx = inner[0], cy = inner[1]+(h*(r-1)), cw = inner[2], ch = h;
            
            cl = cells.length-1;

            if (cl < 1) continue;
            w = cw/cl;

            ctx.save();
            setOption(ctx, cells[0]);
            for(c=1,cl=cells.length; c<cl; c++){
                uis = cells[c];
                rect = [cx+w*(c-1), cy, w, ch];

                ul = uis.length-1;

                if (ul < 1) continue;

                ctx.save();
                setOption(ctx, uis[0]);
                for(u=1,ul=uis.length; u<ul; u++){
                    ui = uis[u];
                    switch(ui.type){
                    case me.TYPE_TEXT: drawMeshText.call(this, ctx, rect, ui, tileSets[ui.tileSet || DEFAULT], tileScale); break;
                    case me.TYPE_TILE: drawMeshTile.call(this, ctx, rect, ui, tileSets[ui.tileSet || DEFAULT], tileScale); break;
                    case me.TYPE_BUTTON: drawMeshButton.call(this, ctx, rect, ui, tileSets[ui.tileSet || DEFAULT], tileScale); break;
                    case me.TYPE_CUSTOM: this.signal('draw', [ctx, setInner(rect, ui), ui, tileSets[ui.tileSet || DEFAULT], tileScale]); break;
                    case me.TYPE_MESH: drawMeshUI.call(this, ctx, rect, ui, tileSets, tileScale, font); break;
                    }
                }
                ctx.restore();
            }
            ctx.restore();
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
            if (MESH_ROWS === key) continue;
            ui[key] = val;
        }

        val = ui[MESH_W];
        if (!val) ui[MESH_W] = width;
        val = ui[MESH_H];
        if (!val) ui[MESH_H] = height;

        if (!ui[MESH_CELL_PT]) ui[MESH_CELL_PT] = me.CENTER;
        if (!ui[MESH_UI_PT]) ui[MESH_UI_PT] = me.CENTER;
        if (!ui[MESH_PAD]) ui[MESH_PAD] = 0;

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
            rheight = ui[MESH_H]/(rl-1);
            for(r=1; r<rl; r++){
                cells = rows[r];
                ucells =[];
                ucells.push(cells[0]);
                urows.push(ucells);
                cl = cells.length;
                cwidth = ui[MESH_W]/(cl-1);
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

    me.drawMeshUI = function(ctx, rect, meshUI, tileSets, tileScale, font){
        //always start from 0,0 not rect.x, rect.y. it will be offset in uiWindow
        drawMeshUI.call(this, ctx, [0, 0, rect.width, rect.height], meshUI, tileSets, tileScale, font);
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
    // options.: text to replace by icon
    me.fillIconText = function(ctx, ts, text, x, y, width, height, scale, options){
        var
        align = 2,
        baseline = 2,
        padX = 0, padY = 0,
        font,
        symbol = '`',
        lineWords = [],
        lineLens = [],
        words = [],word,
        lens = [],len,lineW=0,lineH=0,
        lastWord=false,
        metrics,k,l,offX,offY,dim,iconOff;

        if (options){
            align = options.align || align;
            baseline = options.baseline || baseline;
            padX = options.padX || padX;
            padY = options.padY || padY;
            font = options.font;
            symbol = options.symbol || symbol;
            scale = scale || 1;
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
        if (font) ctx.font = font;

        for(var i=0,j=0; -1 !== j;) {
            j = text.indexOf(' ', i);
            lastWord = j < 0;
            if (symbol === text.charAt(i)){
                word = lastWord ? text.substring(i) : text.substring(i, j);
                i = j;
                word = parseInt(word.substring(1));
                dim = ts.getDimension(word);
                len = dim[2] * scale;
            }else{
                word = lastWord ? text.substring(i) : text.substring(i, j + 1);
                i = j + 1;
                metrics = ctx.measureText(word);
                len = metrics.width;
            }
            if (len > width) break; // width too small
            if (lineW + len > width || lastWord){
                if (lastWord && lineW + len < width){
                    words.push(word);
                    lens.push(len);
                }

                lineWords.push(words.slice());
                lineLens.push(lens.slice());

                // edge case, last and exceeded line width
                if (lastWord){
                    if (lineW + len > width){
                        lineWords.push([word]);
                        lineLens.push([len]);
                    }
                    break;
                }

                lineW = 0;
                words.length = 0;
                lens.length = 0;
            }
            lineW += len;
            words.push(word);
            lens.push(len);
        }

        if (!lineWords.length) return;
        lineH = height/lineWords.length;

        for(i=0,j=lineWords.length; i<j; i++){
            words = lineWords[i];
            lens = lineLens[i];
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
                if ('string' === typeof word){
                    ctx.fillText(word, offX, offY);
                }else{
                    dim = ts.getDimension(word);
                    ts.draw(ctx, word, offX, offY - ((dim[3]*scale)*iconOff), dim[2]*scale, dim[3]*scale);
                }
                offX += lens[k];
            }
            
        }
        ctx.restore();
        return y;
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
