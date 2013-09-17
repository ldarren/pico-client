// use picBase for intercomponent sigslot
pico.def('picBase', function(){

    this.create = function(entity, data){
        return data;
    };

    this.destroy = function(entity, data){
    };

    this.show = function(entity, data){
    };

    this.hide = function(entity, data){
    };

    this.findHost = function(entities, name){
        if (!entities) return;
        var e;
        for(var i=0, l=entities.length; i<l; i++){
            e = entities[i];
            if (name === e.name) return e;
        }
    };

    this.findHostByCom = function(entities, name){
        if (!entities) return;
        var e, com;
        for(var i=0, l=entities.length; i<l; i++){
            e = entities[i];
            com = e.getComponent(name);
            if (com) return e;
        }
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
        this.hiddenList = [];
        this.routes = {};
        this.paths = [];
        this.events = [];
        this.loopList = {};
        this.selected = [];
    };

    me.removeFromReactor = function(reactor){
        this.host = undefined;

        this.entities.length = 0;
        this.hiddenList.length = 0;
        this.routes = {};
        this.paths.length = 0;
        this.events.length = 0;
        this.loopList = {};
        this.selected.length = 0;
    };

    me.createEntity = function(name){
        return new Entity(name, this);
    };

    me.removeEntity = function(name){
        var i = this.getEntityIndex(name);

        if (-1 === i) return;
        var e = this.entities[i];
        e.detachAll();
        this.entities.splice(i, 1);

        return e;
    };

    me.addEntity = function(ent){
        var e = ('string' === typeof ent ? this.createEntity(ent) : ent);
        this.entities.push(e);
        return e;
    };

    me.captureSelected = function(elapsed, evt, entities){
        var
        selected = this.selected,
        e;

        // dun use concat to conserve memory
        for(var i=0,l=entities.length; i<l; i++){
            e = entities[i];
            if (!e) continue;
            selected.push(e);
console.debug('capture', e.name); // for skill can't click bug
        }
console.debug('captured count', this.selected.length); // for skill can't click bug
        return entities;
    };

    me.releaseSelected = function(elapsed, evt, entities){
        this.selected.length = 0;
console.debug('released'); // for skill can't click bug
        return entities;
    };

    me.useSelected = function(elapsed, evt, entities){
if (this.selected.length) console.debug('use', this.selected.length, this.selected[0].name); // for skill can't click bug
        return this.selected.slice();
    };

    me.showEntity = function(name){
        var
        hl = this.hiddenList,
        ent;

        for(var e=0, el=hl.length; e<el; e++){
            ent = hl[e];
            if (name === ent.name){
                this.entities.push(ent);
                hl.splice(e, 1);

                var
                coms = ent.components,
                comNames = Object.keys(coms),
                com, comName;

                for(var c=0, cl=comNames.length; c<cl; c++){
                    comName = comNames[c];
                    com = coms[comName];
                    pico.getModule(comName).show.call(ent.host, ent, com);
                }
                return ent;
            }
        }
    };

    me.hideEntity = function(name){
        var i = this.getEntityIndex(name);

        if (-1 === i) return;
        var
        e = this.entities[i],
        coms = e.components,
        comNames = Object.keys(coms),
        com, comName;

        this.hiddenList.push(e);
        this.entities.splice(i, 1);

        for(var c=0,cl=comNames.length; c<cl; c++){
            comName = comNames[c];
            com = coms[comName];
            pico.getModule(comName).hide.call(e.host, e, com);
        }
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
            this.loopList[route] = evt;
        }
    };

    me.stopLoop = function(route){
        delete this.loopList[route];
    };

    me.updateLoop = function(route, evt){
        var l = this.loopList;
        if (l[route]){
            l[route] = evt;
        }
    };

    me.go = function(route, evt){
        var r = this.routes[route];
        if (!r) {
            console.error(route, 'route not found');
            return false;
        }
        this.paths.push(r);
        this.events.push(evt);

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
                function(callback){ return window.setTimeout(callback, 34); };
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

            // new paths might come in during the previous loop
            paths.splice(0, pl);
            events.splice(0, pl);
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
        cancelAnimFrame(requestId);
        requestId = 0;
    }

    function onRequestRestart(evt){
        var
        loop = false,
        g;
        for(var r=0, rl=groups.length; r<rl; r++){
            g = groups[r];
            loop = loop || Object.keys(g.loopList).length > 0;
        }
        if (loop){
            me.step();
        }
    }

    window.addEventListener('focus', onRequestRestart, false);
    window.addEventListener('blur', onRequestPause, false);
});
