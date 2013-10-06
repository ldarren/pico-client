pico.def('picUIWindow', 'picBase', function(){
    var me = this;

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
    Object.defineProperty(me, 'TYPE_ICON',      {value:1, writable:false, configurable:false, enumerable:true});
    Object.defineProperty(me, 'TYPE_BUTTON',    {value:2, writable:false, configurable:false, enumerable:true});
    Object.defineProperty(me, 'TYPE_WINDOW',    {value:3, writable:false, configurable:false, enumerable:true});

    this.fitIntoGrid = function(rect, gzX, gzY, smaller){
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

    this.generateGridLayout = function(rect, itemWidth, itemHeight, rowCount, colCount){
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

    this.fillWrapText = function(ctx, text, x, y, maxWidth, lineHeight){
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

    this.drawData = function(ctx, ts, icon, value, x, y, iconSize, margin, valueWidth){
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

    this.drawButtons = function(ctx, layouts, labels, fontColor, faceColor, borderColor){
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

    this.createBorderLayout = function(){
    };

    this.createBorderRow = function(){
    };

    this.createBorderCell = function(row){
    };

    this.createBorderUI = function(cell, type, cellMatch, uiMatch, width, height, ui){
    };

    this.drawBorderLayout = function(ctx, rect, margin, layout){
    };

    this.draw = function(ctx, ent, clip){
        // place holder
    };

    this.drawScreenshot = function(ctx, ent, clip, bitmap){
        // place holder
    };
});
