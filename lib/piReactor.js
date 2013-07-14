// use picBase for intercomponent sigslot
pico.def('picBase', function(){

    this.create = function(entity, data){
        return data;
    };

    this.destroy = function(entity, data){
    };
});

pico.def('picGroup', function(){
    var me = this;

    function Entity(name, host){
        this.name = name;
        this.host = host;
        this.components = {};
    }

    Entity.prototype.attach = function(component, data){
        this.components[component.moduleName] = component.create.call(this.host, this, data);
    };

    Entity.prototype.detach = function(component){
        var
        name = component.moduleName,
        data = this.getComponent(name);
        if (!data) return;
        component.destroy.call(this.host, this, data);
        delete this.components[name];
    };

    Entity.prototype.detachAll = function(){
        var
        host = this.host,
        components = this.components,
        keys = Object.keys(components),
        name, opt, component;

        for(var i=0, l=keys.length; i<l; i++){
            name = keys[i];
            component = pico.getModule(name);
            component.destroy.call(host, this, this.getComponent(name));
        }
        this.components = {};
    };

    Entity.prototype.getComponent = function(name){
        return this.components[name];
    };

    me.addToReactor = function(reactor){
        this.host = reactor;

        this.entities = [];
        this.routes = {};
        this.paths = [];
        this.events = [];
        this.loopList = {};
    };

    me.removeFromReactor = function(reactor){
    };

    me.createEntity = function(name){
        var e = new Entity(name, this);
        this.entities.push(e);
        return e;
    };

    me.removeEntity = function(name){
        var
        i = this.getEntityIndex(name),
        e;

        if (-1 === i) return;
        e = this.entities[i];
        e.detachAll();
        this.entities.splice(i, 1);

        return e;
    };

    me.getEntity = function(name){
        var i = this.getEntityIndex(name);
        if (-1 === i) return;
        return this.entities[i];
    };

    me.getEntityIndex = function(name){
        var es = this.entities;
        for(var e=0, el=es.length; e<el; e++){
            if (name === es[e].name) return e;
        }
        return -1;
    };

    me.route = function(route, path){
        this.routes[route] = path;
    };

    me.clearRoute = function(route){
        delete this.routes[route];
    };

    me.startLoop = function(route, evt){
        if (this.go(route, evt)){
            this.loopList[route] = evt || {};
        }
    };

    me.stopLoop = function(route){
        delete this.loopList[route];
    };

    me.go = function(route, evt){
        var r = this.routes[route];
        if (!r) {
            console.error(route, 'route not found');
            return false;
        }
        this.paths.push(r);
        this.events.push(evt || null);

        this.host.step();

        return true;
    };
});

pico.def('piReactor', function(){

    var
    me = this,
    groups = [],
    requestId,
    lastUpdateMS = Date.now(),
    requestAnimFrame = (function(){
        return  window.requestAnimationFrame       || 
                window.webkitRequestAnimationFrame || 
                window.mozRequestAnimationFrame    || 
                window.oRequestAnimationFrame      || 
                window.msRequestAnimationFrame     ||
                function(callback){ window.setTimeout(callback, 17); };
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
                entities = group.entities; // reset entities
                tasks = paths[p];
                evt = events[p];

                for(t=0,tl=tasks.length; t<tl; t++){
                    task = tasks[t];
                    entities = task.call(group, elapsed, evt, entities);
                    if (!entities || !entities.length) break;
                }
            }

            paths.length = 0;
            events.length = 0;
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
        if (loop) requestId = requestAnimFrame(update);
    }

    requestId = requestAnimFrame(update);

    // some android devices can't resume requestAnimFrame after changing tab, these focus and blur events is to over come it
    function onRequestPause(){
        console.log('cancelled', requestId);
        cancelAnimFrame(requestId);
        requestId = 0;
    }

    function onRequestRestart(){
        var
        loop = false,
        g;
        for(var r=0, rl=groups.length; r<rl; r++){
            g = groups[r];
            loop = loop || Object.keys(g.loopList).length > 0;
        }
        if (loop){
            cancelAnimFrame(requestId);
            requestId = requestAnimFrame(update);
        }
    }

    window.addEventListener('focus', onRequestRestart, false);
    window.addEventListener('blur', onRequestPause, false);
});
