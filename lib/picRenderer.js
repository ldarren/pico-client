pico.def('picRenderer', 'picBase', function(){

    var
    me = this,
    DRAW_METHOD = 'draw',
    contexts = {},          // contexts information
    contextOrder = [],      // context render order
    drawEntities = {},      // draw entity list
    drawComponents = {},    // draw option list
    clearRect = function(ctx, rect){
        ctx.clearRect.apply(ctx, rect);
    };

    me.create = function(entity, data){
        var
        cids = Object.keys(data),
        cid, components, c, cl;

        for(var i=0, l=cids.length; i<l; i++){
            cid = cids[i];
            components = data[cid];
            for(c=0,cl=components.length; c<cl; c++){
                drawEntities[cid].push(entity);
                drawComponents[cid].push(components[c]);
            }
        }

        return data;
    };

    me.destroy = function(entity, data){
        var
        cids = Object.keys(data),
        cid, components, component, c, cl,
        e, el, entityList, componentList;

        for(var i=0, l=cids.length; i<l; i++){
            cid = cids[i];
            entityList = drawEntities[cid],
            componentList = drawComponents[cid];
            components = data[cid];
            for(c=0,cl=components.length; c<cl; c++){
                component = components[c];
                for(e=0,el=componentList.length; e<el; e++){
                    if (component === componentList[e]){
                        entityList.splice(e, 1);
                        componentList.splice(e, 1);
                        break;
                    }
                }
            }
        }
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
        contexts[id] = {context:context, zOrder:zOrder, rect:rect || [0,0,0,0], alpha: 1, isDirty: false};
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

            dComs = Object.keys(o);
            for(c=0,cl=dComs.length; c<cl; c++){
                contextOpt = contexts[dComs[c]];
                contextOpt.isDirty = true;
            }
        }

        for(i=0, l=contextOrder.length; i<l; i++){
            cid = contextOrder[i];
            contextOpt = contexts[cid];
            ctx = contextOpt.context,
            rect = contextOpt.rect;

            dComs = drawComponents[cid];
            cl = dComs.length;
            if (!cl) continue;
            dEntities = drawEntities[cid];

            ctx.save();
            ctx.globalAlpha = contextOpt.alpha;

            clearRect(ctx, rect);

            for(c=0; c<cl; c++){
                e = dEntities[c];
                o = dComs[c];
                mod = pico.getModule(o);
                mod[DRAW_METHOD].call(mod, ctx, e, rect);
            }
            ctx.restore();
            contextOpt.isDirty = false;
        }

        return entities;
    };
});
