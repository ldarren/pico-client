pico.def('picRenderer', 'picBase', function(){

    var
    me = this,
    contexts = {},          // contexts information
    contextOrder = [],      // context render order
    emptyArr = [],
    preTasks = {},          // pre option list
    preEntities = {},       // pre entity list
    drawTasks = {},         // draw option list
    drawEntities = {},      // draw entity list
    clearRect = function(ctx, rect){
        ctx.clearRect.apply(ctx, rect);
    };

    me.registerContext = function(id, context, zOrder, rect){
        drawTasks[id] = emptyArr;
        drawEntities[id] = emptyArr;
        var cid, contextObj;
        for(var c=0, cl=contextOrder.length; c<cl; c++){
            cid = contextOrder[c];
            contextObj = contexts[cid];
            if (contextObj.zOrder < zOrder){
                contextOrder.splice(c, 0, id);
                break;
            }
        }
        contexts[id] = {context:context, zOrder:zOrder; rect:rect};
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
        delete drawTasks[id];
        delete drawEntities[id];
    };

    me.clearContexts = function(){
        contexts = {};
        contextOrder = [];
        drawTasks = {};
        drawEntities = {};
    };

    me.draw = function(elapsed, entities){
        var
        name = me.moduleName,
        e, o, cid, contextOpt, dTasks, dEntities, i, l, t, tl, com;

        for(i=0, l=entities.length; i<l; i++){
            e = entities[i];
            o = e.getComponent(name);
            if (!o) continue;
            cid = o.contextId;
            preTasks[cid].push(o);
            preEntities[cid].push(e);
            if (o.isDirty) {
                drawTasks[cid] = preTasks[cid];
                drawEntities[cid] = preEntities[cid];
            }
        }

        for(i=0, l=contextOrder.length; i<l; i++){
            cid = contextOrder[i];
            dTasks = drawTasks[cid];
            tl = dTasks.length;
            if (!tl) continue;
            dEntities = drawEntities[cid];
            contextOpt = contexts[cid];

            for(t=0; t<tl; t++){
                e = dEntities[t];
                o = dTasks[t];
                com = e.getComponent(o.targetName);
                com[o.funcName].call(com, context, e, elapsed);
            }
            drawEntities[cid] = emptyArr;
            drawTasks[cid] = emptyArr;
            preEntities[cid].length = 0;
            preTasks[cid].length = 0;
        }

        return entities;
    };
});
