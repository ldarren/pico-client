pico.def('piDataNet', function(){

    Object.defineProperty(this, 'BEAT', {value:this.moduleName+'.beat', writable:false, configurable:false, enumerable:true});

    var
    me = this,
    beatId = 0,
    config = {},
    outbox = {},
    acks = [],
    onBeat = function(delay, startTime){
        var
        outboxKeys = Object.keys(outbox),
        endPos = 0;

        beatId = 0;
        me.signal(me.BEAT);

        // post update tasks
        if (outboxKeys.length || acks.length){
            var req = acks.slice(0);
            acks.length = 0;
            outboxKeys.sort();
            for (var i=0, l=outboxKeys.length; i<l; i++){
                req.push(outbox[outboxKeys[i]]);
            }
console.log('req',req);
            pico.ajax('post', config.pushURL, req, null, function(err, xhr){
                // schedule next update
                if (!beatId && 4 === xhr.readyState){
                    beatId = setTimeout(onBeat, delay, delay, Date.now());
                }

                if (err) return console.error(err);

                try{
                    var
                    json = xhr.responseText.substr(endPos),
                    res = JSON.parse(json);
                }catch(exp){
                    // incomplete json, return first
                    return;
                }
                endPos = xhr.responseText.length;
                if (!res || !res.modelId) return console.error(res);

                model = pico.modules[res.modelId];
                model.sync(res);
                console.log('res', res);
            });
        }else{
            beatId = setTimeout(onBeat, delay, delay, Date.now());
        }
    };

    this.init = function(cfg){
        for (var key in cfg){
            config[key] = cfg[key];
        }
        config.beatRate = config.beatRate || 1000;
        if (beatId) clearTimeout(beatId);
        beatId = setTimeout(onBeat, 1000, config.beatRate, Date.now());
    };


    this.addOutbox = function(key, data){
        outbox[key] = data;
    };

    this.searchOutbox = function(api){
        for (var key in outbox){
            if (api === outbox[key].api) return key;
        }
        return;
    };

    this.getOutbox = function(key){
        return outbox[key];
    };

    this.delOutbox = function(key){
        delete outbox[key];
    };

    this.addAck = function(obj){
        acks.push(obj);
    };
});

pico.def('piDataModel', function(){

    Object.defineProperty(this, 'UPDATE', {value:this.moduleName+'.update', writable:false, configurable:false, enumerable:true});

    this.use('piDataNet');
    this.localStorage = window.localStorage;

    var
    me = this,
    constructModelKey = function(modelId, index){ return modelId + '.' + index; },
    encodeBufferId = function(req){ return req.api + '@' + req.reqId; },
    decodeBufferId = function(key){
        var
        arr = key.split('.'),
        id = {modelId: arr[0]};

        if (arr.length < 2) return id;

        if (-1 === arr[1].indexOf('@')){ // key = modelId.index
            id.index = arr[1];
        }else{ // key = modelId.method:reqId
            arr = arr[1].split('@');
            id.method = '.'+arr[0];
            id.reqId = arr[1];
        }

        return id;
    },
    constructIndex = function(indexKeys, data){
        var
        indexKeys = indexKeys,
        index = [],
        value;
        for (var i=0, l= indexKeys.length; i<l; i++){
            value = data[indexKeys[i]];
            if (!value) return false;
            index.push(value);
        }
        return JSON.stringify(index);
    },
    constructReq = function(modelId, method, data){
        var req = {
                api: modelId + method,
                reqId: Date.now(),
                data: data
            };
        if (G_CCONST.ACK === method){
            me.piDataNet.addAck(req);
        }else{
            var bufferId = encodeBufferId(req);
            me.localStorage.setItem(bufferId, JSON.stringify(req));
            me.piDataNet.addOutbox(bufferId, req);
        }
        return req;
    };

    // modelId = 'players'
    // index = ['playerId']
    this.init = function(modelId, indexKeys){

        this.modelId = modelId;
        this.indexKeys = indexKeys;

        var
        UPDATE = G_CCONST.UPDATE,
        net = this.piDataNet,
        storage = this.localStorage,
        id, json, updates = [], coll = {};

        for (var key in storage){
            id = decodeBufferId(key);
            if (id.modelId !== modelId) continue;

            json = JSON.parse(storage.getItem(key));
            if (id.index){
                coll[id.index] = json;
            }else{
                if (UPDATE === id.method) updates.push(json);
                net.addOutbox(key, json);
            }
        }

        var index, data, src, dst;
        for(var i=0,l=updates.length; i<l; i++){
            data = updates[i].data;
            for(index in data){
                src = data[index];
                dst = coll[index] || {};
                for(key in src){
                    dst[key] = dst[key];
                }
            }
        }
        this.collection = coll;
        this.signal(this.UPDATE);
    };
    this.sync = function(res){
        if (!res || !res.api) return;

        var
        net = this.piDataNet,
        storage = this.localStorage,
        indexKeys = this.indexKeys,
        modelId = this.modelId,
        bufferId = encodeBufferId(res);

        if (res.error){
            alert(res.error);
        }else{
            var
            apiArr = res.api.split('.'),
            method = '.'+apiArr[1],
            rowSvr, key, value, index;

            if (G_CCONST.UPDATE === method){
                var
                buffer = net.getOutbox(bufferId),
                data = buffer.data,
                modelKey;

                for(var k in data){
                    value = data[k];
                    index = constructIndex(indexKeys, value);
                    modelKey = constructModelKey(modelId, index);

                    rowSvr = storage.getItem(modelKey);
                    rowSvr = rowSvr ? JSON.parse(rowSvr) : {};
                    for (key in value){
                        rowSvr[key] = value[key];
                    }
                    storage.setItem(modelKey, JSON.stringify(rowSvr));
                }
            }else{
                var
                data = res.data,
                coll = this.collection;

                for(var k in data){
                    value = data[k];
                    index = constructIndex(indexKeys, value);
                    modelKey = constructModelKey(modelId, index);

                    switch(method){
                        case G_CCONST.INIT:
                        case G_CCONST.CREATE:
                            coll[index] = value;
                            storage.setItem(modelKey, JSON.stringify(value));
                            break;
                        case G_CCONST.ACK:
                            break;
                        case G_CCONST.READ:
                            rowSvr = coll[index] || {};
                            for (key in value){
                                rowSvr[key] = value[key];
                            }
                            coll[index] = rowSvr;
                            storage.setItem(modelKey, JSON.stringify(rowSvr));
                            break;
                        case G_CCONST.DELETE:
                            delete coll[index]; // just in case it is still there
                            storage.removeItem(modelKey);
                            break;
                    }
                }
            }
        }

        storage.removeItem(bufferId);
        net.delOutbox(bufferId);

        constructReq(modelId, G_CCONST.ACK, {resId: res.resId});

        if (method !== G_CCONST.ACK) this.signal(this.UPDATE);
    };
    this.requestOnce = function(method, update){
        if (this.piDataNet.searchOutbox(this.modelId + method)) return;
        this.request(method, update);
    };
    this.request = function(method, update){
        constructReq(this.modelId, method, update);
    };
    this.get = function(condition, keys){
        var
        condition = condition || 'all',
        ret = [],
        rows = [],
        coll = this.collection,
        key;

        if ('all' === condition){
            for (key in coll){
                rows.push(coll[key]);
            }
        }else{
            var index = constructIndex(this.indexKeys, condition);
            rows.push(coll[index]);
        }

        if (keys && keys.length){
            var row, collRow, i, l;
            for(var j=0, rl=rows.length; j<rl; j++){
                collRow = {};
                row = rows[j];
                for(i=0,l=keys.length; i<l; i++){
                    key = keys[i];
                    collRow[key] = row[key];
                }
                ret.push(collRow);
            }
        }else{
            ret = rows;
        }
        Object.freeze(ret);
        return ret;
    };
    this.remove = function(keys){
        constructReq(this.modelId, G_CCONST.DELETE, keys);
    };
    this.isValid = function(){
        var keys = Object.keys(this.collection);
        return keys && keys.length;
    };
});
