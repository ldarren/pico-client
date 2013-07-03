pico.def('picRenderer', 'picBase', function(){

    var
    me = this,
    contexts = {},          // contexts information
    contextOrder = [],      // context render order
    drawEntities = {},      // draw entity list
    drawComponents = {},    // draw option list
    clearRect = function(ctx, rect){
        ctx.clearRect.apply(ctx, rect);
    };

    me.create = function(entity, data){
        if (undefined === data.contextId) return console.error('no context id defined in picRenderer');
        if (undefined === data.targetName) return console.error('no targetName defined in picRenderer');
        if (undefined === data.funcName) return console.error('no targetName defined in picRenderer');

        var
        cid = data.contextId,
        entityList = drawEntities[cid],
        componentList = drawComponents[cid];
        if (!entityList || !componentList) return console.error('draw list not found', cid);

        entityList.push(entity);
        componentList.push(data);

        return data;
    };

    me.destroy = function(entity, data){
        var
        cid = data.contextId,
        entityList = drawEntities[cid],
        componentList = drawComponents[cid];
        if (!entityList || componentList) return console.error('draw list not found', cid);

        for(var i=0,l=entityList; i<l; i++){
            if (entity === entityList[i]){
                entityList.splice(i, 1);
                componentList.splice(i, 1);
                break;
            }
        }
    };

    me.registerContext = function(id, context, zOrder, rect){
        
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

        drawComponents[id] = [];
        drawEntities[id] = [];
        contexts[id] = {context:context, zOrder:zOrder, rect:rect, alpha: 1, isDirty: false};
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
                contextOrder[c].rect = [x, y, width, height];
                break;
            }
        }
    };

    me.setGlobalAlpha = function(cid, alpha){
        var co = contexts[cid];
        co.alpha = alpha;
        co.isdirty = true;
    };

    me.makeDirty = function(entity, isDirty){
        var opt = entity.getComponent(me.moduleName);

        if (!opt) return;
        var co = contexts[opt.contextId];
        co.isDirty = isDirty;
    };

    me.draw = function(elapsed, evt, entities){
        var
        name = me.moduleName,
        e, o, cid, contextOpt, ctx,
        dComs, dEntities, mod,
        i, l, c, cl;

        for(i=0, l=entities.length; i<l; i++){
            e = entities[i];
            o = e.getComponent(name);
            if (!o) return;
            contextOpt = contexts[o.contextId];
            contextOpt.isDirty = true;
        }

        for(i=0, l=contextOrder.length; i<l; i++){
            cid = contextOrder[i];
            contextOpt = contexts[cid];
            ctx = contextOpt.context;

            dComs = drawComponents[cid];
            cl = dComs.length;
            if (!cl) continue;
            dEntities = drawEntities[cid];

            ctx.save();
            ctx.globalAlpha = contextOpt.alpha;

            clearRect(ctx, contextOpt.rect);

            for(c=0; c<cl; c++){
                e = dEntities[c];
                o = dComs[c];
                mod = pico.getModule(o.targetName);
                mod[o.funcName].call(mod, ctx, e, elapsed);
            }
            ctx.restore();
            contextOpt.isDirty = false;
        }

        return entities;
    };
});
