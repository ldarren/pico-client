pico.def('picRenderer', 'picBase', function(){

    var
    me = this,
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
        cid, components, c, cl,
        entityList, componentList;

        for(var i=0, l=cids.length; i<l; i++){
            cid = cids[i];
            components = data[cid];
            entityList = drawEntities[cid];
            componentList = drawComponents[cid];
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
    
    // zOrder and rect are optional
    // if rect is not provided, resizeContext must be calld after registerContext
    me.registerContext = function(id, context, zOrder, rect){
        
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
        contexts[id] = {context:context, zOrder:zOrder, rect:rect || [0,0,0,0], alpha:1, clear:context.clearRect, bg:'#000', isDirty: false};
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
        var cid;
        for(var c=0, cl=contextOrder.length; c<cl; c++){
            cid = contextOrder[c];
            if (cid === id){
                contexts[contextOrder[c]].rect = [x, y, width, height];
                break;
            }
        }
    };

    me.setGlobalAlpha = function(cid, alpha){
        var co = contexts[cid];
        co.alpha = alpha;
        co.isdirty = true;
    };

    me.setBG = function(cid, bg){
        var co = contexts[cid];
        if (bg){
            co.bg = bg;
            co.clear = co.context.fillRect;
        }else{
            co.bg = '#000';
            co.clear = co.context.clearRect;
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
        e = entities[0],
        o = e.getComponent(name);
            
        if (!o) return;

        var
        dComs = Object.keys(o),
        maxWidth = 0,
        maxHeight = 0,
        cid, contextOpt, ctx, rect,
        dEntities, mod;

        for(var c=0,cl=dComs.length; c<cl; c++){
            contextOpt = contexts[dComs[c]];
            rect = contextOpt.rect;
            maxWidth = rect[2] > maxWidth ? rect[2] : maxWidth;
            maxHeight = rect[3] > maxHeight ? rect[3] : maxHeight;
            contextOpt.isDirty = true;
        }

        offscreenCanvas.setAttribute('width', maxWidth);
        offscreenCanvas.setAttribute('height', maxHeight);
        ctx = offscreenCanvas.getContext('2d');
        rect = [0, 0, maxWidth, maxHeight];

        for(var i=0, l=contextOrder.length; i<l; i++){
            cid = contextOrder[i];
            contextOpt = contexts[cid];
            if (!contextOpt.isDirty) continue;

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
                mod = pico.getModule(o);
                mod[DRAW_METHOD].call(this, ctx, e, rect);
            }
            ctx.restore();
            contextOpt.isDirty = false;
        }

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
        cid, contextOpt, ctx, rect,
        dEntities, mod;

        for(var c=0,cl=dComs.length; c<cl; c++){
            contextOpt = contexts[dComs[c]];
            contextOpt.isDirty = true;
        }

        for(var i=0, l=contextOrder.length; i<l; i++){
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
                mod = pico.getModule(o);
                mod[DRAW_SCREENSHOT_METHOD].call(this, ctx, e, rect, offscreenCanvas);
            }
            ctx.restore();
            contextOpt.isDirty = false;
        }

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
                mod = pico.getModule(o);
                mod[DRAW_METHOD].call(this, ctx, e, rect);
            }
            ctx.restore();
            contextOpt.isDirty = false;
        }

        return entities;
    };
});
