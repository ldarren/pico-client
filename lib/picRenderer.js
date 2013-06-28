pico.def('picRenderer', 'picBase', function(){

    var
    me = this,
    contexts = {},          // contexts information
    contextOrder = [],      // context render order
    drawEntities = {},      // draw entity list
    drawComponents = {},    // draw option list
    clearRect = function(ctx, rect){
        ctx.clearRect.apply(ctx, rect);
    },
    onEntityDisplayUpdate = function(ent, com, param, newValue, oldValue){
        me.makeDirty(ent);
    };

    Object.getPrototypeOf(me).slot(me.DISPLAY_UPDATE, onEntityDisplayUpdate);

    me.create = function(entity, data){
        if (undefined === data.contextId) return console.error('no context id defined in picRenderer');
        if (undefined === data.targetName) return console.error('no targetName defined in picRenderer');
        if (undefined === data.funcName) return console.error('no targetName defined in picRenderer');

        var
        cid = data.contextId,
        entityList = drawEntities[cid],
        componentList = drawComponents[cid];
        if (!entityList || componentList) return console.error('draw list not found', cid);

        entityList.push(entity);
        componentList.push(data);
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
        drawComponents[id] = [];
        drawEntities[id] = [];
        var cid, contextObj;
        for(var c=0, cl=contextOrder.length; c<cl; c++){
            cid = contextOrder[c];
            contextObj = contexts[cid];
            if (contextObj.zOrder < zOrder){
                contextOrder.splice(c, 0, id);
                break;
            }
        }
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

    me.draw = function(elapsed, entities){
        var
        name = me.moduleName,
        e, o, cid, contextOpt, ctx,
        dComs, dEntities, mod,
        i, l, c, cl;

        for(i=0, l=contextOrder.length; i<l; i++){
            cid = contextOrder[i];
            contextOpt = contexts[cid];
            if (!contextOpt.isDirty) continue;
            ctx = contextOpt.context;

            dComs = drawComponents[cid];
            cl = dComs.length;
            if (!cl) continue;
            dEntities = drawEntities[cid];

            ctx.save();
            ctx.globalAlpha = contextOpt.alpha;

            clearRect(ctx, contextOpt.rect);

            for(c=0; c<cl; t++){
                e = dEntities[c];
                o = dComs[c];
                mod = pica.getModule(o.targetName);
                mod[o.funcName].call(mod, ctx, e, elapsed);
            }
            ctx.restore();
            contextOpt.isDirty = false;
        }

        return entities;
    };
});