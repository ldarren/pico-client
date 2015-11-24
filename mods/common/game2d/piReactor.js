var
groups = [],
isFocused = true,
requestId,
lastUpdateMS = Date.now(),
requestAnimFrame = (function(){
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     ||
            function(callback){ return window.setTimeout(callback, 50); };
})(),
cancelAnimFrame = (function(){
    return  window.cancelAnimationFrame       || 
            window.webkitCancelAnimationFrame || 
            window.mozCancelAnimationFrame    || 
            window.oCancelAnimationFrame      || 
            window.msCancelAnimationFrame     ||
            window.clearTimeout;
})();

me.addGroup = function(group){
    groups.push(group);
    group.addToReactor(me);
    return group;
};

me.step = function(){
    cancelAnimFrame(requestId);
    requestId = requestAnimFrame(update);
};

me.pause = function(){
    cancelAnimFrame(requestId);
    requestId = 0;
};

me.resume = function(){
    if (!isFocused) return;

    var loop = false, g;

    for(var r=0, rl=groups.length; r<rl; r++){
        g = groups[r];
        loop = loop || g.paths.length || Object.keys(g.loopList).length;
    }
    if (loop){
        me.step();
    }
};

function update(){
    var
    now = Date.now(),
    elapsed = now - lastUpdateMS,
    group,r, rl,
    routes, loopList,
    paths, p, pl,
    tasks, task, t, tl,
    entities, events, evt,
    loop = false;

    for(r=0, rl=groups.length; r<rl; r++){
        group = groups[r];
        paths = group.paths;
        events = group.events;
        routes = group.routes;
        loopList = group.loopList;

        for(p=0, pl = paths.length; p<pl; p++){
            if (!requestId) break;

            entities = group.entities; // reset entities
            tasks = paths[p];
            evt = events[p];

            for(t=0,tl=tasks.length; t<tl; t++){
                task = tasks[t];
                if (!task) debugger; // HACK. remove in production
                entities = task.call(group, elapsed, evt, entities);
                if (!entities || !entities.length || !requestId) break;
            }
        }

        // new paths might come in during the previous loop
        paths.splice(0, p);
        events.splice(0, p);
        tasks = Object.keys(loopList);
        tl=tasks.length;
        loop = loop || tl > 0;
        for(t=0; t<tl; t++){
            task = tasks[t];
            paths.push(routes[task]);
            events.push(loopList[task]);
        }
    }
    lastUpdateMS = now;
    if (loop && requestId) {
        requestId = requestAnimFrame(update);
    }
}

requestId = requestAnimFrame(update);

// some android devices can't resume requestAnimFrame after changing tab, these focus and blur events is to over come it
function onRequestPause(evt){
    isFocused = false;
    me.pause();
}

function onRequestRestart(evt){
    isFocused = true;
    me.resume();
}

window.addEventListener('focus', onRequestRestart, false);
window.addEventListener('blur', onRequestPause, false);
