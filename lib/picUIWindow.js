pico.def('picUIWindow', 'picBase', function(){
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

    this.draw = function(ctx, ent, clip){
        // place holder
    };

    this.drawScreenshot = function(ctx, ent, clip, bitmap){
        // place holder
    };
});
