pico.def('picBase', function(){

    Object.defineProperty(this, 'DISPLAY_UPDATE', {value:'dispUpdate', writable:false, configurable:false, enumerable:true});
    Object.defineProperty(this, 'RULE_UPDATE', {value:'ruleUpdate', writable:false, configurable:false, enumerable:true});

    this.create = function(entity, data){
        return data;
    };

    this.destroy = function(entity, data){
    };
});

pico.def('piReactor', function(){
    function Entity(name){
        this.name = name;
        this.components = {};
    }

    Entity.prototype.attach = function(component, data){
        this.components[component.moduleName] = component.create(this, data);
    };

    Entity.prototype.detach = function(component){
        var data = this.getComponent(component.moduleName);
        if (!data) return;
        component.destroy(this, data);
        this.components[component.moduleName] = undefined;
    };

    Entity.prototype.detachAll = function(){
        var
        components = this.components,
        keys = Object.keys(components),
        name, opt, component;
        for(var i=0, l=keys.length; i<l; i++){
            name = keys[i];
            component = pico.getModule(name);
            component.destroy(this, this.getComponent(name));
        }
        this.components = {};
    };

    Entity.prototype.getComponent = function(name){
        return this.components[name];
    };
    
    function Reactor(){
        this.entities = [];
        this.routes = {};
        this.defaultPaths = [];
        this.defaultEvents = [];
        this.paths = [];
        this.events = [];
    }

    Reactor.prototype.newEntity = function(name){
        var e = new Entity(name);
        this.entities.push(e);
        return e;
    };

    Reactor.prototype.removeEntity = function(name){
        var
        i = this.getEntityIndex(name),
        e;

        if (-1 === i) return;
        e = this.entities[i];
        e.detachAll();
        this.entities.splice(i, 1);
    };

    Reactor.prototype.getEntity = function(name){
        var i = this.getEntityIndex(name);
        if (-1 === i) return;
        return this.entities[i];
    };

    Reactor.prototype.getEntityIndex = function(name){
        var es = this.entities;
        for(var e=0, el=es.length; e<el; e++){
            if (name === es[e].name) return e;
        }
        return -1;
    };

    Reactor.prototype.route = function(route, path){
        this.routes[route] = path;
    };

    Reactor.prototype.addPathTo = function(index, path, evt){
        this.defaultPaths[index] = path;
        this.defaultEvents[index] = evt || null;
    };

    Reactor.prototype.removePath = function(index){
        this.defaultPaths.splice(index, 1);
        this.defaultEvents.splice(index, 1);
    };

    Reactor.prototype.clearPaths = function(){
        this.defaultPaths = [];
        this.defaultEvents = [];
    };

    Reactor.prototype.go = function(route, evt){
        var r = this.routes[route];
        if (!r) return;
        this.paths.push(r);
        this.events.push(evt || null);
    };

    var
    reactors = [],
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

    this.createReactor = function(){
        var r = new Reactor();
        reactors.push(r);
        return r;
    };

    function update(){
        var
        now = Date.now(),
        elapsed = now - lastUpdateMS,
        reactor, r, rl, paths, pl, tasks, task, t, tl, entities,
        events, evt;

        for(r=0, rl=reactors.length; r<rl; r++){
            reactor = reactors[r];
            paths = reactor.paths;
            events = reactor.events;

            pl = paths.length;
            for(p=0; p<pl; p++){
                entities = reactor.entities; // reset entities
                tasks = paths[p];
                evt = events[p];

                for(t=0,tl=tasks.length; t<tl; t++){
                    task = tasks[t];
                    entities = task(elapsed, evt, entities);
                    if (!entities || !entities.length) break;
                }
            }
            reactor.paths = reactor.defaultPaths.slice(0);
            reactor.events = reactor.defaultEvents.slice(0);
        }
        lastUpdateMS = now;
        requestId = requestAnimFrame(update);
    }

    requestId = requestAnimFrame(update);

    // some android devices can't resume requestAnimFrame after changing tab, these focus and blur events is to over come it
    function onRequestPause(evt){
        cancelAnimFrame(requestId);
    }

    function onRequestRestart(evt){
        cancelAnimFrame(requestId);
        requestId = requestAnimFrame(update);
    }

    window.addEventListener('focus', onRequestRestart, false);
    window.addEventListener('blur', onRequestPause, false);
});
