pico.def('picCircleGeom', 'picBase', function(){
    this.use('picTween');
    var
    me = this,
    name = me.moduleName,
    o, x, y, w, h, // for optimization
    updateShape = function(rect, data){
        data.x = rect.x;
        data.y = rect.y;

        w = rect.width;
        h = rect.height;

        data.radius = Math.sqrt(w*w + h*h);
    };

    me.updateShapes = function(elapsed, evt, entities){
        var
        tween = me.picTween,
        e, data, rect;

        for(var i=0,l=entities.length; i<l; i++){
            e = entities[i];
            data = e.getComponent(name);
            rect = tween.getByEntity(e, data.rectComponent);
            data.x = rect.x;
            data.y = rect.y;
        }
        return entities;
    };

    me.create = function(entity, data){
        if (undefined === data.rectComponent) return console.error('undefined rectComponent');
        var rect = entity.getComponent(data.rectComponent);
        if (!rect) return console.error('rectComponent not found', data.rectComponent);
        updateShape(rect, data);

        if (undefined === data.startAngle) data.startAngle = 0;
        if (undefined === data.endAngle) data.endAngle = Math.PI * 2;
        if (undefined === data.anticlockwise) data.anticlockwise = true;
        //if (undefined === data.strokeStyle) data.strokeStyle = 'rgba(0,0,255,1)';
        //if (undefined === data.fillStyle) data.fillStyle = 'rgba(0,0,255,1)';
        if (undefined === data.lineWidth) data.lineWidth = 1;
        if (undefined === data.lineCap) data.lineCap = 'butt';
        if (undefined === data.lineJoin) data.lineJoin = 'bevel';
        if (undefined === data.miterLimit) data.miterLimit = 10;
        // TODO: linear gradient
        // TODO: radial gradient
        // TODO: pattern
        // TODO: shadow

        return data;
    };

    me.draw = function(ctx, ent, elapsed){
        o = ent.getComponent(name);
        x = o.x;
        y = o.y;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, o.radius, o.startAngle, o.endAngle, o.anticlockwise);
        ctx.closePath();
        if (o.fillStyle){
            ctx.fillStyle = o.fillStyle;
            ctx.fill();
        }
        if (o.strokeStyle){
            ctx.strokeStyle = o.strokeStyle;
            ctx.fill();
        }
        ctx.restore();
    }
});
