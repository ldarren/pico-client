function Event(name, route, data){
    this.name = name;
    this.route = route;
    this.data = data;
    this.children = [];
}

Event.prototype.chain = function(name, route, data){
    var child = new Event(name, route, data);
    this.children.push(child);
    return child;
};

Event.prototype.branch = function(name, route, data){
    var child = new Event(name, route, data);
    this.children.push(child);
    return this;
};

Event.prototype.get = function(key){
    return this.data[key];
};

Event.prototype.go = function(i){
    var child = this.children[i];
    me.go(child.route, child.data);
};

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

module.exports = {
    createEvent: function(data){
        return new Event(null, null, data);
    },

    addToReactor: function(reactor){
        this.host = reactor;

        this.entities = [];
        this.hiddenList = [];
        this.routes = {};
        this.paths = [];
        this.events = [];
        this.loopList = {};
        this.selected = [];
    },

    removeFromReactor: function(reactor){
        this.host = undefined;

        this.entities.length = 0;
        this.hiddenList.length = 0;
        this.routes = {};
        this.paths.length = 0;
        this.events.length = 0;
        this.loopList = {};
        this.selected.length = 0;
    },

    createEntity: function(name){
        return new Entity(name, this);
    },

    removeEntity: function(name){
        var i = this.getEntityIndex(name);

        if (-1 === i) return;
        var e = this.entities[i];
        e.detachAll();
        this.entities.splice(i, 1);

        return e;
    },

    addEntity: function(ent){
        var e = ('string' === typeof ent ? this.createEntity(ent) : ent);
        this.entities.push(e);
        return e;
    },

    captureSelected: function(elapsed, evt, entities){
        var
        selected = this.selected,
        e;

        // dun use concat to conserve memory
        for(var i=0,l=entities.length; i<l; i++){
            e = entities[i];
            if (!e) continue;
            selected.push(e);
        }
        return entities;
    },

    releaseSelected: function(elapsed, evt, entities){
        this.selected.length = 0;
        return entities;
    },

    useSelected: function(elapsed, evt, entities){
        return this.selected.slice();
    },

    execComFunc: function(ent, func, evt){
        var
        coms = ent.components,
        comNames = Object.keys(coms),
        com, comName;

        for(var c=0, cl=comNames.length; c<cl; c++){
            comName = comNames[c];
            com = coms[comName];
            pico.getModule(comName)[func].call(ent.host, ent, com, evt);
        }
    },

    showEntity: function(param, evt){
        var
        name = ('string' === typeof param) ? param : param.name,
        ent = this.showEntityByIndex(this.getEntityIndex(name, this.hiddenList), evt);

        if (!ent){
            ent = this.getEntity(name);
            if (ent) this.execComFunc(ent, 'show', evt);
        }

        return ent;
    },

    showAllEntities: function(evt){
        for(var i=0, l=this.hiddenList.length; i<l; i++){
            this.showEntityByIndex(0, evt); // 0 is not a typo
        }
    },

    showEntityByIndex: function(i, evt){
        var
        hl = this.hiddenList,
        ent = hl[i];

        if (!ent) return;

        this.entities.push(ent);
        hl.splice(i, 1);
        this.execComFunc(ent, 'show', evt);

        return ent;
    },

    hideEntity: function(param, evt){
        var name = ('string' === typeof param) ? param : param.name;
        return this.hideEntityByIndex(this.getEntityIndex(name), evt);
    },

    hideAllEntities: function(evt){
        for(var i=0, l=this.entities.length; i<l; i++){
            this.hideEntityByIndex(0, evt);
        }
    },

    hideEntityByIndex: function(i, evt){
        var
        e = this.entities[i];
        if (!e) return;

        this.hiddenList.push(e);
        this.entities.splice(i, 1);
        this.execComFunc(e, 'hide', evt);

        return e;
    },

    getEntity: function(name, list){
        var i = this.getEntityIndex(name, list);
        if (-1 === i) return;
        list = list || this.entities;
        return list[i];
    },

    getEntityIndex: function(name, list){
        list = list || this.entities;
        for(var e=0, el=list.length; e<el; e++){
            if (name === list[e].name) return e;
        }
        return -1;
    },

    route: function(route, path){
        this.routes[route] = path;
        return path;
    },

    clearRoute: function(route){
        delete this.routes[route];
    },

    getRoute: function(route){
        return this.routes[route];
    },

    startLoop: function(route, evt){
        if (this.go(route, evt)){
            this.loopList[route] = evt;
        }
    },

    stopLoop: function(route){
        delete this.loopList[route];
    },

    updateLoop: function(route, evt){
        var l = this.loopList;
        if (l[route]){
            l[route] = evt;
        }
    },

    getLoopEvent: function(route){
        return this.loopList[route];
    },

    go: function(route, evt){
        var r = this.routes[route];
        if (!r) {
            console.error(route, 'route not found');
            return false;
        }

        var
        paths = this.paths,
        events = this.events,
        lastR = paths.pop();

        if (lastR === r){
            events.pop();
    console.info('removed repeated: '+route);
        }else if (lastR){
            paths.push(lastR);
        }

    console.info('go: '+route);
        paths.push(r);
        events.push(evt);

        this.host.step();

        return true;
    },

    pause: function(){this.host.pause();},
    resume: function(){this.host.resume();},
};
