pico.def('piComponentBase', function(){
    this.create = function(entity, data){
        return data;
    };

    this.remove = function(entity, data){
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
        var data = this.getComponent(component);
        if (!data) return;
        component.remove(this, data);
        this.components[component.moduleName] = undefined;
    };

    Entity.prototype.getComponent = function(component){
        return this.components[component.moduleName];
    };
    
    function Reactor(){
        this.entities = [];
        this.routes = {};
        this.paths = [];
    }

    Reactor.prototype.newEntity = function(name){
        var e = new Entity(name);
        this.entities.push(e);
        return e;
    };

    Reactor.prototype.removeEntity = function(name){
        var i = this.getEntityIndex(name);
        if (-1 === i) return;
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

    Reactor.prototype.go = function(route){
        var r = this.routes[route];
        if (!r) return;
        this.paths.push(r);
    };

    var
    reactors = [],
    requestId,
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

    function onRequestPause(evt){
        cancelAnimFrame(requestId);
    }

    function onRequestRestart(evt){
        cancelAnimFrame(requestId);
        requestId = requestAnimFrame(update);
    }

    function update(){
        var reactor, r, rl, paths, pl, tasks, tasks, t, tl, entities;

        for(r=0, rl=reactors.length; r<rl; r++){
            reactor = reactors[r];
            paths = reactor.paths;

            pl = paths.length;
            if (!pl) continue;

            while(pl--){
                entities = reactor.entities;
                tasks = paths.shift();

                for(t=0,tl=tasks.length; t<tl; t++){
                    task = tasks[t];
                    entities = task(entities);
                    if (!entities || !entities.length) break;
                }
            }
        }
        requestId = requestAnimFrame(update);
    }

    requestId = requestAnimFrame(update);
    window.addEventListener('focus', onRequestRestart, false); // android bug? no resume requestAnimFrame after change tab
    window.addEventListener('blur', onRequestPause, false);
});
