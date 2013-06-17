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
        this.components[component.moduleName] = component.create(entity, data);
    };

    Entity.prototype.dettach = function(component){
        var data = this.getComponent(component);
        if (!data) return;
        component.remove(entity, data);
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

    Reactor.prototype.getiEntityIndex = function(name){
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
    requestAnimFrame = (function(){
        return  window.requestAnimationFrame       || 
                window.webkitRequestAnimationFrame || 
                window.mozRequestAnimationFrame    || 
                window.oRequestAnimationFrame      || 
                window.msRequestAnimationFrame     || 
                function( callback ){
                    window.setTimeout(callback, 17);
                };
    })();

    this.createReactor = function(){
        var r = new Reactor();
        reactors.push(r);
        return r;
    };

    function update(){
        var reactor, r, rl, paths, pl, tasks, tasks, t, tl, entities, e, el;

        for(r=0, rl=reactors.length; r<rl; r++){
            reactor = reactors[r];
            paths = reactor.paths;

            pl = paths.length;
            if (!pl) continue;

            entities = reactor.entities;

            while(pl--){
                tasks = paths.shift();

                for(t=0,tl=tasks.length; t<tl; t++){
                    task = tasks[t];

                    for(e=0, el=entities.length; e<el; e++){
                        if (!task(entities[e])) break;
                    }
                }
            }
        }

        requestAnimFrame(update);
    }

    requestAnimFrame(update);
});
