pico.def('picUIWindow', 'picBase', function(){
    var me = this;

    Object.defineProperty(me, 'TOP_LEFT',   {value:3, writable:false, configurable:false, enumerable:true});
    Object.defineProperty(me, 'TOP',        {value:1, writable:false, configurable:false, enumerable:true});
    Object.defineProperty(me, 'TOP_RIGHT',  {value:5, writable:false, configurable:false, enumerable:true});
    Object.defineProperty(me, 'LEFT',       {value:2, writable:false, configurable:false, enumerable:true});
    Object.defineProperty(me, 'CENTER',     {value:16, writable:false, configurable:false, enumerable:true});
    Object.defineProperty(me, 'RIGHT',      {value:4, writable:false, configurable:false, enumerable:true});
    Object.defineProperty(me, 'BOTTOM_LEFT',{value:10, writable:false, configurable:false, enumerable:true});
    Object.defineProperty(me, 'BOTTOM',     {value:8, writable:false, configurable:false, enumerable:true});
    Object.defineProperty(me, 'BOTTOM_RIGHT',{value:12, writable:false, configurable:false, enumerable:true});

    Object.defineProperty(me, 'TYPE_TEXT',      {value:1, writable:false, configurable:false, enumerable:true});
    Object.defineProperty(me, 'TYPE_TILE',      {value:2, writable:false, configurable:false, enumerable:true});
    Object.defineProperty(me, 'TYPE_BUTTON',    {value:3, writable:false, configurable:false, enumerable:true});
    Object.defineProperty(me, 'TYPE_CUSTOM',    {value:4, writable:false, configurable:false, enumerable:true});
    Object.defineProperty(me, 'TYPE_LAYOUT',    {value:5, writable:false, configurable:false, enumerable:true});

    var
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
    drawBorderRow = function(ctx, rect, row){
        var
        l = row.length-1,
        i, w;

        if (l < 1) return;
        w = rect[2]/l;

        ctx.save();
        setOption(ctx, row[0]);
        for(i=1,l=row.length; i<l; i++){
            drawBorderCell(ctx, [rect[0]+w*(i-1), rect[1], w, rect[3]], row[i]);
        }
        ctx.restore();
    },
    drawBorderCell = function(ctx, rect, cell){
        var
        l = cell.length-1,
        i, ui;

        if (l < 1) return;

        ctx.save();
        setOption(ctx, cell[0]);
        for(i=1,l=cell.length; i<l; i++){
            ui = cell[i];
            switch(ui.type){
                case me.TYPE_TEXT:
                    drawBorderText(ctx, rect, ui);
                    break;
                case me.TYPE_TILE:
                    drawBorderTile(ctx, rect, ui);
                    break;
                case me.TYPE_BUTTON:
                    drawBorderButton(ctx, rect, ui);
                    break;
                case me.TYPE_CUSTOM:
                    drawBorderCustom(ctx, rect, ui);
                    break;
                case me.TYPE_LAYOUT:
                    drawBorderLayout(ctx, rect, ui);
                    break;
            }
        }
        ctx.restore();
    },
    drawBorderText = function(ctx, rect, borderText){
        var inner = setInner(rect, borderText);

        ctx.save();
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        me.fillWrapText(ctx, borderText.text, inner[0], inner[1], borderText.w, borderText.h);
        ctx.restore();
    },
    drawBorderTile = function(ctx, rect, borderTile){
        var inner = setInner(rect, borderTile);

        borderTile.tileSet.draw(ctx, borderTile.tileId, inner[0], inner[1], inner[2], inner[3]);
    },
    drawBorderButton = function(ctx, rect, borderButton){
        var inner = setInner(rect, borderButton);

        ctx.fillRect.apply(ctx, inner);
        ctx.strokeRect.apply(ctx, inner);
        ctx.save();
        ctx.fillStyle = borderButton.color;
        ctx.fillText(borderButton.text, inner[0], inner[1], inner[2]);
        ctx.restore();
    },
    drawBorderLayout = function(ctx, rect, borderLayout){
        var
        inner = setInner(rect, borderLayout),
        layout = borderLayout.layout,
        l = layout.length-1,
        h, i;

        if (l < 1) return;
        h = inner[3]/l;

        ctx.save();
        setOption(ctx, layout[0]);
        for(i=1,l=layout.length; i<l; i++){
            drawBorderRow(ctx, [inner[0], inner[1]+(h*(i-1)), inner[2], h], layout[i]);
        }
        ctx.restore();
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

    me.createBorderOption = function(strokeStyle, fillStyle, font, alpha, lineWidth, lineCap, lineJoin){
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

    me.createBorderRow = function(layout, option){
        var newRow = [option || {}];
        layout.push(newRow);
        return newRow;
    };

    me.createBorderCell = function(row, option){
        var cell = [option || {}];
        row.push(cell);
        return cell;
    };

    me.createBorderText = function(cell, cellPt, uiPt, pad, width, height, text){
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

    me.createBorderTile = function(cell, cellPt, uiPt, pad, width, height, tileSet, tileId){
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

    me.createBorderButton = function(cell, cellPt, uiPt, pad, width, height, fontColor, label, cb, evt){
        var ui = {
            type: me.TYPE_BUTTON,
            cellPt: cellPt,
            uiPt: uiPt,
            pad: pad,
            w: width,
            h: height,
            color: fontColor,
            text: label,
            cb: cb,
            evt: evt
        };
        cell.push(ui);
        return ui;
    };

    me.createBorderCustom = function(cell, cellPt, uiPt, pad, width, height, userData, cb){
        var ui = {
            type: me.TYPE_CUSTOM,
            cellPt: cellPt,
            uiPt: uiPt,
            pad: pad,
            w: width,
            h: height,
            userData: userData,
            cb: cb 
        };
        cell.push(ui);
        return ui;
    };

    me.createBorderLayout = function(cell, cellPt, uiPt, pad, width, height, option){
        var ui = {
            type: me.TYPE_LAYOUT,
            cellPt: cellPt,
            uiPt: uiPt,
            pad: pad,
            w: width,
            h: height,
            layout: [option || {}]
        };
        if (cell) cell.push(ui); // layout could be the topmost item
        return ui;
    };

    me.drawBorderLayout = function(ctx, rect, layout){
        drawBorderLayout(ctx, [rect.x, rect.y, rect.width, rect.height], layout);
    };

    me.draw = function(ctx, ent, clip){
        // place holder
    };

    me.drawScreenshot = function(ctx, ent, clip, bitmap){
        // place holder
    };
});
