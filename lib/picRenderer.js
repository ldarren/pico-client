inherit('pico/picBase');

var
name = me.moduleName,
DRAW_METHOD = 'draw',
DRAW_SCREENSHOT_METHOD = 'drawScreenshot',
contexts = {},          // contexts information
contextOrder = [],      // context render order
drawEntities = {},      // draw entity list
drawComponents = {},    // draw option list
offscreenCanvas = document.createElement('canvas');

me.create = function(entity, data){
    var
    cids = Object.keys(data),
    cid, components, c, cl, com, ci, cil,
    entityList, componentList, i, l;

    for(var i=0, l=cids.length; i<l; i++){
        cid = cids[i];
        components = data[cid];
        entityList = drawEntities[cid];
        componentList = drawComponents[cid];
        for(c=0,cl=components.length; c<cl; c++){
            com = components[c];
            for(ci=0,cil=componentList.length; ci<cil; ci++){
                if (entity === entityList[ci] && com === componentList[ci]) return data;
            }
        }
        for(c=0,cl=components.length; c<cl; c++){
            entityList.push(entity);
            componentList.push(components[c]);
        }
    }

    return data;
};

me.destroy = function(entity, data){
    var
    cids = Object.keys(data),
    cid, e, entityList, componentList;

    for(var i=0, l=cids.length; i<l; i++){
        cid = cids[i];
        entityList = drawEntities[cid],
        componentList = drawComponents[cid];
        e = 0;
        while(e < entityList.length){
            if (entity === entityList[e]){
                entityList.splice(e, 1);
                componentList.splice(e, 1);
                continue;
            }
            e++;
        }
    }
};

me.show = function(ent, data){
    me.create.call(this, ent, data);
};

me.hide = function(ent, data){
    me.destroy.call(this, ent, data);
};

// zOrder is optional
// resizeContext must be called after registerContext
me.registerContext = function(id, context, zOrder){
    if (undefined === zOrder){
        zOrder = contextOrder.length ? contexts[contextOrder[contextOrder.length-1]].zOrder + 100 : 100;
        contextOrder.push(id);
    }else{
        if (contextOrder.length){
            var cid, contextObj;
            for(var c=0, cl=contextOrder.length; c<cl; c++){
                if (cid === id) return;
                cid = contextOrder[c];
                contextObj = contexts[cid];
                if (contextObj.zOrder < zOrder){
                    contextOrder.splice(c, 0, id);
                    break;
                }
            }
        }else{
            contextOrder.push(id);
        }
    }

    drawComponents[id] = [];
    drawEntities[id] = [];
    contexts[id] = {
        context:context,
        zOrder:zOrder,
        rect:[0,0,0,0],
        alpha:1,
        clear:context.clearRect,
        bg:'transparent',
        isDirty: false};
};

me.deregisterContext = function(id){
    var cid;
    for(var c=0, cl=contextOrder.length; c<cl; c++){
        cid = contextOrder[c];
        if (cid === id){
            contextOrder.splice(c, 1);
            break;
        }
    }
    delete contexts[id];
    delete drawComponents[id];
    delete drawEntities[id];
};

me.clearContexts = function(){
    contexts = {};
    contextOrder = [];
    drawComponents = {};
    drawEntities = {};
};

me.resizeContext = function(id, x, y, width, height){
    var con = contexts[id];
    if (!con) return;
    con.rect = [x, y, width, height];
};

me.setGlobalAlpha = function(cid, alpha){
    var co = contexts[cid];
    co.alpha = alpha;
    co.isdirty = true;
};

me.setBG = function(cid, bg, clearFunc){
    var co = contexts[cid];
    if (bg){
        co.bg = bg;
        co.clear = co.context.fillRect;
    }else{
        co.bg = 'transparent';
        co.clear = co.context.clearRect;
    }
    if (clearFunc){
        co.clear = clearFunc;
    }
    co.isdirty = true;
};

me.makeDirty = function(entity, isDirty){
    var opt = entity.getComponent(me.moduleName);

    if (!opt) return;
    var co = contexts[opt.contextId];
    co.isDirty = isDirty;
};

me.captureScreenshot = function(elapsed, evt, entities){
    var
    maxRect = [0, 0, 0, 0],
    e, o, cid, contextOpt, ctx, rect,
    dComs, dEntities, mod,
    i, l, c, cl;

    for(i=0, l=entities.length; i<l; i++){
        e = entities[i];
        o = e.getComponent(name);
        if (!o) continue;

        dComs = Object.keys(o);
        for(c=0,cl=dComs.length; c<cl; c++){
            contextOpt = contexts[dComs[c]];
            rect = contextOpt.rect;
            if (maxRect[0] > rect[0]) maxRect[0] = rect[0];
            if (maxRect[1] > rect[1]) maxRect[1] = rect[1];
            if (maxRect[2] < rect[2]) maxRect[2] = rect[2];
            if (maxRect[3] < rect[3]) maxRect[3] = rect[3];
            contextOpt.isDirty = true;
        }
    }

    offscreenCanvas.setAttribute('width', maxRect[2]);
    offscreenCanvas.setAttribute('height', maxRect[3]);
    ctx = offscreenCanvas.getContext('2d');

    ctx.save();

    ctx.fillStyle = 'transparent';
    ctx.clearRect(maxRect[0], maxRect[1], maxRect[2], maxRect[3]);

    for(i=0, l=contextOrder.length; i<l; i++){
        cid = contextOrder[i];
        contextOpt = contexts[cid];
        if (!contextOpt.isDirty) continue;

        dComs = drawComponents[cid];
        cl = dComs.length;
        if (!cl) continue;
        dEntities = drawEntities[cid];

        rect = contextOpt.rect;
        ctx.fillStyle = contextOpt.bg;
        ctx.fillRect(rect[0], rect[1], rect[2], rect[3]);
        ctx.globalAlpha = contextOpt.alpha;

        for(c=0; c<cl; c++){
            e = dEntities[c];
            o = dComs[c];
            mod = require(o);
            mod[DRAW_METHOD].call(this, ctx, e, rect);
        }
        contextOpt.isDirty = false;
    }

    ctx.restore();

    return entities;
};

me.releaseScreenshot = function(elapsed, evt, entities){
    if(offscreenCanvas){
        offscreenCanvas.setAttribute('width', 0);
        offscreenCanvas.setAttribute('height', 0);
    }
    return entities;
};

me.drawScreenshot = function(elapsed, evt, entities){
    var
    e = entities[0],
    o = e.getComponent(name);
        
    if (!o) return;

    var
    dComs = Object.keys(o),
    contextName = dComs[0],
    comName = o[contextName][0],
    contextOpt = contexts[contextName],
    ctx = contextOpt.context, 
    rect = contextOpt.rect, 
    mod = require(comName);

    ctx.save();
    ctx.fillStyle = contextOpt.bg;
    contextOpt.clear.apply(ctx, rect);
    ctx.globalAlpha = contextOpt.alpha;
    mod[DRAW_SCREENSHOT_METHOD].call(this, ctx, e, rect, offscreenCanvas, evt);

    ctx.restore();

    return entities;
};

me.draw = function(elapsed, evt, entities){
    var
    e, o, cid, contextOpt, ctx, rect,
    dComs, dEntities, mod,
    i, l, c, cl;

    for(i=0, l=entities.length; i<l; i++){
        e = entities[i];
        o = e.getComponent(name);
        if (!o) continue;

        dComs = Object.keys(o);
        for(c=0,cl=dComs.length; c<cl; c++){
            contextOpt = contexts[dComs[c]];
            contextOpt.isDirty = true;
        }
    }

    for(i=0, l=contextOrder.length; i<l; i++){
        cid = contextOrder[i];
        contextOpt = contexts[cid];
        if (!contextOpt.isDirty) continue;

        ctx = contextOpt.context,
        rect = contextOpt.rect;

        dComs = drawComponents[cid];
        cl = dComs.length;
        if (!cl) continue;
        dEntities = drawEntities[cid];

        ctx.save();
        ctx.fillStyle = contextOpt.bg;
        contextOpt.clear.apply(ctx, rect);
        ctx.globalAlpha = contextOpt.alpha;

        for(c=0; c<cl; c++){
            e = dEntities[c];
            o = dComs[c];
            mod = require(o);
            mod[DRAW_METHOD].call(this, ctx, e, rect, evt);
        }
        ctx.restore();
        contextOpt.isDirty = false;
    }

    return entities;
};

me.clear = function(elapsed, evt, entities){
    var
    e, o, contextOpt, cvs, ctx, rect,
    dComs, i, l, c, cl;

    for(i=0, l=entities.length; i<l; i++){
        e = entities[i];
        o = e.getComponent(name);
        if (!o) continue;

        dComs = Object.keys(o);
        for(c=0,cl=dComs.length; c<cl; c++){
            contextOpt = contexts[dComs[c]];
            contextOpt.isDirty = true;
        }
    }

    for(i=0, l=contextOrder.length; i<l; i++){
        contextOpt = contexts[contextOrder[i]];
        if (!contextOpt.isDirty) continue;

        ctx = contextOpt.context,
        rect = contextOpt.rect;

        ctx.save();

        ctx.fillStyle = contextOpt.bg;
        contextOpt.clear.apply(ctx, rect);

        ctx.restore();

        contextOpt.isDirty = false;
    }

    return entities;
};
