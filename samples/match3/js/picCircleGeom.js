pico.def('picCircleGeom', 'picBase', function(){
    this.use('picTween');
    var
    me = this,
    name = me.moduleName,
    o, x, y, w, h, // for optimization
    updateShape = function(tween, data){
        data.x = tween.x[0];
        data.y = tween.y[0];

        w = tween.w[0];
        h = tween.h[0];

        data.radius = Math.sqrt(w*w + h*h);
    };

    me.updateShapes = function(elapsed, evt, entities){
        var
        tween = me.picTween,
        e, data, rect;

        for(var i=0,l=entities.length; i<l; i++){
            e = entities[i];
            data = e.getComponent(name);
            rect = tween.getValues(e, data.rectComponent);
            updateShape(rect, data);
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
        o = ent.getComponent(me.moduleName);
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
