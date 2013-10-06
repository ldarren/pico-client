pico.def('picUIWindow', 'picBase', function(){
    var me = me;

    Object.defineProperty(me, 'TOP_LEFT',   {value:0, writable:false, configurable:false, enumerable:true});
    Object.defineProperty(me, 'TOP',        {value:1, writable:false, configurable:false, enumerable:true});
    Object.defineProperty(me, 'TOP_RIGHT',  {value:2, writable:false, configurable:false, enumerable:true});
    Object.defineProperty(me, 'LEFT',       {value:3, writable:false, configurable:false, enumerable:true});
    Object.defineProperty(me, 'CENTER',     {value:4, writable:false, configurable:false, enumerable:true});
    Object.defineProperty(me, 'RIGHT',      {value:5, writable:false, configurable:false, enumerable:true});
    Object.defineProperty(me, 'BOTTOM_LEFT',{value:6, writable:false, configurable:false, enumerable:true});
    Object.defineProperty(me, 'BOTTOM',     {value:7, writable:false, configurable:false, enumerable:true});
    Object.defineProperty(me, 'BOTTOM_RIGHT',{value:8, writable:false, configurable:false, enumerable:true});

    Object.defineProperty(me, 'TYPE_TEXT',      {value:0, writable:false, configurable:false, enumerable:true});
    Object.defineProperty(me, 'TYPE_TILE',      {value:1, writable:false, configurable:false, enumerable:true});
    Object.defineProperty(me, 'TYPE_BUTTON',    {value:2, writable:false, configurable:false, enumerable:true});
    Object.defineProperty(me, 'TYPE_LAYOUT',    {value:3, writable:false, configurable:false, enumerable:true});

    var
    calBorderRow = function(){
    },
    calBorderCell = function(){
    },
    calBorderText = function(){
    },
    calBorderTile = function(){
    },
    calBorderButton = function(){
    },
    calBorderLayout = function(){
    },
    setOption = function(ctx, option){
    },
    drawBorderRow = function(ctx, row){
    },
    drawBorderCell = function(ctx, cell){
    },
    drawBorderText = function(ctx, text){
    },
    drawBorderTile = function(ctx, tile){
    },
    drawBorderButton = function(ctx, button){
    },
    drawBorderLayout = function(ctx, rect, layout){
        var
        sizes = calBorderLayout(rect, layout),
        row;

        for(var r=0,rl=layout.length; r<rl; r++){
            row = layout[r];
            drawBorderRow(ctx, row);
        }

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
            stroke: strokeStyle,
            fill: fillStyle,
            alpha: alpha
            weigth: lineWidth,
            cap: lineCap,
            joint: lineJoin
        };
    };

    me.createBorderRow = function(layout, option){
        var newRow = [option || {}];
        layout.push(newRow);
        return newRow;
    };

    me.createBorderCell = function(row, option){
        var newCell = [option || {}];
        row.push(cell);
        return cell;
    };

    me.createBorderText = function(cell, cellPt, uiPt, width, height, text){
        cell.push({
            type: me.TYPE_TEXT,
            cellPt: cellPt,
            uiPt: uiPt,
            w: width,
            h: height,
            text: text
        });
    };

    me.createBorderTile = function(cell, cellPt, uiPt, width, height, tileId){
        cell.push({
            type: me.TYPE_TILE,
            cellPt: cellPt,
            uiPt: uiPt,
            w: width,
            h: height,
            tileId: tileId
        });
    };

    me.createBorderButton = function(cell, cellPt, uiPt, width, height, label, cb, evt){
        cell.push({
            type: me.TYPE_BUTTON,
            cellPt: cellPt,
            uiPt: uiPt,
            w: width,
            h: height,
            text: label,
            cb: cb,
            evt: evt
        });
    };

    me.createBorderLayout = function(cell, cellPt, uiPt, width, height, layout, option){
        cell = cell || [];
        cell.push({
            type: me.TYPE_LAYOUT,
            cellPt: cellPt,
            uiPt: uiPt,
            w: width,
            h: height,
            layout: [option || {}]
        });
        return cell;
    };

    me.drawBorderLayout = function(ctx, rect, layout){
    };

    me.draw = function(ctx, ent, clip){
        // place holder
    };

    me.drawScreenshot = function(ctx, ent, clip, bitmap){
        // place holder
    };
});
